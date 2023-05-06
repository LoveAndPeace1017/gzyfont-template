import asyncComponent from 'utils/asyncComponent';

const routes = [
    {
        path: '/',
        exact: true,
        isAuthed: 1,
        component: asyncComponent(() => import('pages/orderTrack/sale/index'))
    },
    {
        path: '/home',
        current: '/',
        isAuthed: 1,
        component: asyncComponent(() => import('pages/orderTrack/sale/index'))
    },
    {
        path: '/sale/show/:id',
        uid: '/sale/show/',
        current: '/sale/',
        isAuthed: '1',
        authModule: 'sale',
        authType: 'show',
        component: asyncComponent(() => import('pages/orderTrack/sale/show')),
    },
];

export default routes;