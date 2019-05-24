using ReactExample.EDM;
using System.Linq;
using System.Web.Http;
using System.Linq.Dynamic;
using System.Web.Http.Controllers;
using System.Web.Security;
using System.Security.Claims;

namespace DotWeb.Api
{
    public class BaseApiController : ApiController
    {
        protected Bpple_DBEntities db0;
        protected int defPageSize = 10;
        protected string LoginId;
        protected string LoginType; //Admin:系統管理員 Manager:管理者 Member:會員
        protected override void Initialize(HttpControllerContext controllerContext)
        {

            var headers = string.Empty;
            foreach (var _header in controllerContext.Request.Headers)
            {
                var s = string.Empty;
                foreach (var ss in _header.Value)
                {
                    s = s + ss;
                }
                headers += "[" + _header.Key + "=" + s + "]";

            }
            
            base.Initialize(controllerContext);

            if (User.Identity.GetType() == typeof(FormsIdentity))
            {
                var identity = (FormsIdentity)User.Identity; //一定要有值 無值為系統出問題
                if (identity != null)
                {
                    #region Code
                    LoginId = identity.Ticket.Name;//userid
                                                   //本專案一個帳號只對映一個role 以first role為主
                    var roles = identity.Ticket.UserData.Split(',');
                    LoginType = roles.FirstOrDefault();
                    #endregion
                }
            }
            else if (User.Identity.GetType() == typeof(ClaimsIdentity))
            {
                var identity = (ClaimsIdentity)User.Identity;
                var Claim = identity.Claims.Where(c => c.Type == ClaimTypes.Role).FirstOrDefault();
                LoginType = Claim.Value;
                LoginId = identity.Name;
            }
        }
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