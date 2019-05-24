using LinqKit;
using ProcCore.HandleResult;
using ProcCore.WebCore;
using ReactExample.EDM;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace DotWeb.Api
{
    [RoutePrefix("api/Member")]
    [Authorize(Roles = "M")]//Roles可設可不設
    public class MemberController : BaseApiController
    {
        /// <summary>
        /// 取得查詢資料及Grid Page資料
        /// </summary>
        /// <param name="q"></param>
        /// <returns></returns>
        public async Task<IHttpActionResult> Get([FromUri] QGet q)
        {
            var r = new ResultData<GridInfo>();
            int page = q.page == null ? 1 : (int)q.page;
            var predicate = PredicateBuilder.True<Member>();

            if (q.keyword != null)
                predicate = predicate.And(x => x.name.Contains(q.keyword) || x.zip.Contains(q.keyword) || x.city.Contains(q.keyword)
                            || x.country.Contains(q.keyword) || x.address.Contains(q.keyword));

            using (db0 = new Bpple_DBEntities())
            {
                var item_where = db0.Member.AsExpandable().Where(predicate);
                var item_count = await item_where.CountAsync(); //取得此條件下總筆數

                //進行排序 或點選欄位排序
                IQueryable<Member> item_order = null;

                if (!SortField(item_where, q._field, q._sort, out item_order))
                    item_order = item_where.OrderByDescending(x => new { x.id }); //沒有排序進行預設排序

                int start_record = PageCount.PageInfo(page, defPageSize, item_count); //計算分頁資訊，取得需跳至開始的那一筆。

                var get_item = await item_order
                    .Select(x => new
                    {
                        x.id,
                        x.name,
                        x.birthday,
                        x.zip,
                        x.city,
                        x.country,
                        x.address,
                        x.state
                    }).AsExpandable()
                    .Skip(start_record)
                    .Take(defPageSize)
                    .ToListAsync();

                r.state = 0; //設定狀態 0:正常
                r.exist = get_item.Any();
                r.data = new GridInfo()
                {
                    rows = get_item,
                    total = PageCount.TotalPage,
                    page = PageCount.Page,
                    records = PageCount.RecordCount,
                    startcount = PageCount.StartCount,
                    endcount = PageCount.EndCount,
                    field = q._field,
                    sort = q._sort
                };
                return Ok(r);
            }
        }
        /// <summary>
        /// 取得單一資料
        /// </summary>
        /// <param name="p"></param>
        /// <returns></returns>
        [Route("Item")]
        public async Task<IHttpActionResult> Get([FromUri] QItem p)
        {
            var r = new ResultData<Member>();
            var id = p.id;
            using (db0 = new Bpple_DBEntities())
            {
                var item = await db0.Member.FindAsync(id);
                r.state = 0;
                r.data = item;
                r.exist = item != null;
                return Ok(r);
            }
        }

        /// <summary>
        /// 新增
        /// </summary>
        /// <param name="p"></param>
        /// <returns></returns>
        public async Task<IHttpActionResult> Post([FromBody] PostData p)
        {
            var r = new ResultInsert<int>();

            var md = p.md;
            var id = p.id;

            using (db0 = new Bpple_DBEntities())
            {
                try
                {
                    db0.Member.Add(md);
                    await db0.SaveChangesAsync();
                    r.state = 0;
                    r.id = md.id;
                }
                catch (Exception ex)
                {
                    r.state = 999;
                    r.message = ex.Message;
                }
                return Ok(r);
            }
        }
        /// <summary>
        /// 修改
        /// </summary>
        /// <param name="p"></param>
        /// <returns></returns>
        [Route("Modify")]
        [HttpPost]
        public async Task<IHttpActionResult> Modify([FromBody] PutData p)
        {
            var r = new ResultBase();
            var md = p.md;
            var id = p.id;

            using (db0 = new Bpple_DBEntities())
            {
                try
                {
                    #region set value
                    db0.Entry(md).State = EntityState.Modified;
                    await db0.SaveChangesAsync();
                    #endregion
                    r.state = 0;
                }
                catch (Exception ex)
                {
                    r.state = 999;
                    r.message = ex.Message;
                }
                return Ok(r);
            }
        }

        [Route("Remove")]
        [HttpPost]
        public async Task<IHttpActionResult> Remove([FromBody] QItem p)
        {
            var r = new ResultBase();
            var id = p.id;
            using (db0 = new Bpple_DBEntities())
            {
                try
                {
                    var md = await db0.Member.FindAsync(id);

                    var entry = db0.Entry<Member>(md);
                    entry.State = EntityState.Deleted;
                    await db0.SaveChangesAsync();
                    
                    r.state = 0;
                }
                catch (Exception ex)
                {
                    r.state = 999;
                    r.message = ex.Message;
                }
                return Ok(r);
            }
        }

        #region 接收參數
        public class GridBase
        {
            public int? page { get; set; }
            /// <summary>
            /// 排序欄位
            /// </summary>
            public string _field { get; set; }
            /// <summary>
            /// 排序順序
            /// </summary>
            public string _sort { get; set; }
        }
        /// <summary>
        /// 多條件查詢參數
        /// </summary>
        public class QGet : GridBase
        {
            public string keyword { get; set; }
        }
        /// <summary>
        /// 取得單一一筆資料
        /// </summary>
        public class QItem
        {
            public int id { get; set; }
        }
        /// <summary>
        /// Post 物件參數
        /// </summary>
        public class PostData
        {
            public int id { get; set; }
            public Member md { get; set; }
        }
        /// <summary>
        /// Put 物件參數 加Id
        /// </summary>
        public class PutData
        {
            public int id { get; set; }
            public Member md { get; set; }
        }
        #endregion
    }
}