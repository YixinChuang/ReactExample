const path: {
    Get_Member: ApiPathStruct,
    Get_Member_Item: ApiPathStruct,
    Post_Member: ApiPathStruct,
    Post_Member_Modify: ApiPathStruct,
    Post_Member_Remove: ApiPathStruct,
}
    =
{
    Get_Member: { path: 'api/Member', method: 'GET' },
    Get_Member_Item: { path: 'api/Member/Item', method: 'GET' },
    Post_Member: { path: 'api/Member', method: 'POST' },
    Post_Member_Modify: { path: 'api/Member/Modify', method: 'POST' },
    Post_Member_Remove: { path: 'api/Member/Remove', method: 'POST' }
}

export default path;