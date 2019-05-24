using DotWeb.CommSetup;
using Newtonsoft.Json;
using ProcCore.HandleResult;
using ReactExample.EDM;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace ReactExample.Controllers
{
    [Authorize(Roles = "M")]//Roles可設可不設
    public class HomeController : Controller
    {
        public HomeController()
        {
            ViewBag.IsFirstPage = false;
        }
        [AllowAnonymous]
        public ActionResult Index()
        {
            ViewBag.IsFirstPage = true;
            return View();
        }

        public ActionResult Member()
        {
            return View();
        }
        public ActionResult ShowCode01()
        {
            return View();
        }
        public ActionResult ShowCode02()
        {
            return View();
        }
        #region 登入驗證
        [HttpPost]
        [AllowAnonymous]
        public async Task<string> loginCheck(LoginViewModel model)
        {
            LoginResult r = new LoginResult();
            if (!ModelState.IsValid)
            {
                r.message = ModelStateErrorPack();
                r.state = 3; //填寫不完整
                return defJSON(r);
            }
            if (string.IsNullOrEmpty((Session[WebSetup.CheckCodeSession] ?? "").ToString()))
            {
                r.state = 1;
                Session[WebSetup.CheckCodeSession] = Guid.NewGuid();
                r.message = "驗證碼不正確";

                return defJSON(r);
            }
            r.vildate = Session[WebSetup.CheckCodeSession].Equals(model.validate) ? true : false;
            if (!r.vildate)
            {

                Session[WebSetup.CheckCodeSession] = Guid.NewGuid();//只要有錯先隨意產生唯一碼 以防暴力破解，新的CheckCode會在Validate產生。
                r.state = 1; //驗證碼不正確
                r.message = "驗證碼不正確";
                return defJSON(r);
            }
            #region 帳密碼檢查
            using (var db0 = new Bpple_DBEntities())
            {
                try
                {
                    var account = model.account.Trim();
                    var password = ProcCore.EncryptString.Cryp(model.password.Trim());
                    var get_user = await db0.TBLogin.Where(x => x.LoginId == account & x.Pwd == password).FirstOrDefaultAsync();
                    if (get_user == null)
                    {
                        //帳密碼錯誤
                        r.state = 1;
                        r.message = "帳號或密碼錯誤，請重新輸入。";//帳號或密碼錯誤 請重新輸入
                        return defJSON(r);
                    }
                    if (get_user.state == UserState.Stop) //帳號停權
                    {
                        r.state = 2; //帳號停權
                        r.message = "此帳號已停權，無法登入！";
                        return defJSON(r);
                    }
                    #region 後台登錄

                    string user_data = get_user.LoginType; //記錄登錄權限類型
                                                           //有效期限 三天
                    FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, get_user.LoginId, DateTime.Now, DateTime.Now.AddDays(3),
                                                                         false, user_data, FormsAuthentication.FormsCookiePath);
                    string encTicket = FormsAuthentication.Encrypt(ticket);
                    Response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, encTicket));

                    DateTime last_login_time = get_user.last_login ?? DateTime.Now;
                    get_user.last_login = DateTime.Now;
                    await db0.SaveChangesAsync();

                    //寫入所需的Cookie資訊
                    var cookie_loginid = new HttpCookie(WebSetup.Cookie_LoginId, get_user.LoginId.Trim());
                    cookie_loginid.HttpOnly = true;
                    Response.Cookies.Add(cookie_loginid);

                    var cookie_login_type = new HttpCookie(WebSetup.Cookie_RoleId, get_user.LoginType);
                    cookie_login_type.HttpOnly = true;
                    Response.Cookies.Add(cookie_login_type);

                    var cookie_login_name = new HttpCookie(WebSetup.Cookie_UserName, Server.UrlPathEncode(get_user.name));
                    cookie_login_name.HttpOnly = true;
                    Response.Cookies.Add(cookie_login_name);

                    #endregion


                    r.url = Url.Content("~/Home/Member");
                    r.state = 0;
                    return defJSON(r);
                }
                catch (Exception ex)
                {
                    r.message = ex.Message;
                    r.state = 99;
                    return defJSON(r);
                }
            }
            #endregion

        }
        public RedirectResult Logout()
        {
            removeCookie("Cookie_LoginId");
            removeCookie("Cookie_LoginType");
            removeCookie("Cookie_UserName");
            //cache.Clear();
            FormsAuthentication.SignOut();

            return Redirect("~/Home/Index");

        }
        private void removeCookie(string key)
        {
            var c = new HttpCookie(key);
            c.Values.Clear();
            c.Expires = DateTime.Now.AddDays(-1);
            Response.Cookies.Set(c);
        }
        public string ModelStateErrorPack()
        {
            List<string> errMessage = new List<string>();
            foreach (ModelState modelState in ModelState.Values)
                foreach (ModelError error in modelState.Errors)
                    errMessage.Add(error.ErrorMessage);

            return string.Join(":", errMessage);
        }
        protected string defJSON(object o)
        {
            return JsonConvert.SerializeObject(o, new JsonSerializerSettings() { NullValueHandling = NullValueHandling.Include });
        }
        public class LoginViewModel
        {
            [Required]
            public string account { get; set; }
            [Required]
            [DataType(DataType.Password)]
            public string password { get; set; }
            [Required]
            public string validate { get; set; }
        }
        #endregion

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}