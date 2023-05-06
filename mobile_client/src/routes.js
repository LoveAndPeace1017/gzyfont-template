import asyncComponent from 'utils/asyncComponent';

const routes = [
    {
        path: '/',
        exact: true,
        isAuthed: '1',
        component:  asyncComponent(() => import('pages/onlineOrder/newOrderList/index'))
    },
    /*{
        path: '/onlineOrder/orderList',
        exact: true,
        isAuthed: '1',
        component: asyncComponent(() => import('pages/onlineOrder/orderList/index'))
    },*/
    {
        path: '/onlineOrder/cartList',
        exact: true,
        isAuthed: '1',
        component: asyncComponent(() => import('pages/onlineOrder/cartList/index'))
    },
    {
        path: '/onlineOrder/orderList',
        exact: true,
        isAuthed: '1',
        component: asyncComponent(() => import('pages/onlineOrder/newOrderList/index'))
    },
    {
        path: '/onlineOrder/companyIndex/:id',
        exact: true,
        isAuthed: '1',
        component: asyncComponent(() => import('pages/onlineOrder/companyProduct/index'))
    },
    {
        path: '/preview',
        exact: true,
        isAuthed: '1',
        component: asyncComponent(() => import('pages/onlineOrder/companyProduct/index'))
    },
    {
        path: '/onlineOrder/companyIntroduce/:id',
        exact: true,
        isAuthed: '1',
        component: asyncComponent(() => import('pages/onlineOrder/companyIntroduce/index'))
    },
    {
        path: '/onlineOrder/cartDetail/:supplierUserIdEnc/:supplierProductCode',
        exact: true,
        isAuthed: '1',
        component: asyncComponent(() => import('pages/onlineOrder/cartDetail/index'))
    },
    {
        path: '/onlineOrder/orderConfirm',
        exact: true,
        isAuthed: '1',
        component: asyncComponent(() => import('pages/onlineOrder/orderConfirm/index'))
    },
    // 内贸站商机信息列表页面
    {
        path: '/miccn/inquiry/',
        exact: true,
        isAuthed: '1',
        component: asyncComponent(() => import('pages/miccn/inquiry/index/index'))
    },
    //询价单详情
    {
        path: '/miccn/inquiry/:logonUserName/:inquiryId',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/miccn/inquiry/show'))
    },
    //联系信
    {
        path: '/miccn/contact/list/:page',
        exact: true,
        isAuthed: '1',
        component: asyncComponent(() => import('pages/miccn/contactList/index'))
    },
    //联系信
    {
        path: '/miccn/contact/list',
        exact: true,
        isAuthed: '1',
        component: asyncComponent(() => import('pages/miccn/contactList/index'))
    },

    //联系信详情
    {
        path: '/miccn/contact/detail/:type/:id',
        exact: true,
        isAuthed: '1',
        component: asyncComponent(() => import('pages/miccn/contactDetail/index'))
    },
    //新增报价单
    {
        path: '/miccn/quotation/add/:inquiryId',
        exact: true,
        isAuthed: '1',
        component: asyncComponent(() => import('pages/miccn/quotation/add'))
    },
    //报价单详情
    {
        path: '/miccn/quotation/:quotationId',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/miccn/quotation/show'))
    },
    //
    {
        path: '/miccn/repeatProduct',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/miccn/repeatProduct/index'))
    },
];

export default routes;