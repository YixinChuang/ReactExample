using ReactExample.EDM;
using System.Linq;
using System.Web.Http;
using System.Linq.Dynamic;

namespace DotWeb.Api
{
    public class BaseApiController : ApiController
    {
        protected Bpple_DBEntities db0;
        protected int defPageSize = 10;
        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T">資料表模型</typeparam>
        /// <param name="item_where">IQueryable物件資料</param>
        /// <param name="field">要排序的欄位</param>
        /// <param name="sort">排序順序</param>
        /// <param name="result">回傳排序後資料</param>
        /// <returns>是否有進行排序</returns>
        protected bool SortField<T>(IQueryable<T> item_where, string field, string sort, out IQueryable<T> result)
        {
            if (field != null && sort != null && (sort.ToLower() == "asc" || sort.ToLower() == "desc"))
            {
                IQueryable<T> resultOrderItems = null;
                if (sort.ToLower() == "asc")
                    resultOrderItems = item_where.OrderBy(field);

                if (sort.ToLower() == "desc")
                    resultOrderItems = item_where.OrderBy(field + " descending");
                result = resultOrderItems;
                return true;
            }
            else
            {
                result = item_where;
                return false;
            }
        }
    }
}