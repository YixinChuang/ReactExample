using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProcCore.HandleResult
{
    /// <summary>
    /// 回傳基礎類別
    /// </summary>
    public class ResultBase
    {
        /// <summary>
        /// 回傳狀態
        /// </summary>
        public int state { get; set; }
        /// <summary>
        /// 回傳訊息
        /// </summary>
        public string message { get; set; }
        /// <summary>
        /// JSON版本
        /// </summary>
        public string version { get; set; }
    }
    public class ResultData<T> : ResultBase
    {
        public T data { get; set; }
        /// <summary>
        /// 資料是否存在
        /// </summary>
        public bool exist { get; set; }
    }
    public class ResultInsert<T> : ResultBase
    {
        public T id { get; set; }
    }
    public class GridInfo<T> : ResultBase
    {
        public int total;
        public int page;
        public int records;
        public int startcount;
        public int endcount;
        public string sort;
        public string field;
        public IList<T> rows;
    }
    public class GridInfo : ResultBase
    {
        public int total;
        public int page;
        public int records;
        public int startcount;
        public int endcount;
        /// <summary>
        /// 排序順序 ASC DESC
        /// </summary>
        public string sort;
        /// <summary>
        /// 目前排序的欄位
        /// </summary>
        public string field;
        public object rows;
    }
}