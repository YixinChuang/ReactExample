using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DotWeb.CommSetup
{
    /// <summary>
    /// 網站共用設定，從Web.config add key。
    /// </summary>
    public static class WebSetup
    {
        public static string CheckCodeSession
        {
            get
            {
                return "CheckCode";
            }
        }
        public static string Cookie_UserName
        {
            get
            {
                return "UserName";
            }
        }
        public static string Cookie_LoginId
        {
            get
            {
                return "LoginId";
            }
        }
        public static string Cookie_RoleId
        {
            get
            {
                return "LoginType";
            }
        }
    }
}