import asyncComponent from 'utils/asyncComponent';

const routes = [
    {
        path: '/',
        exact: true,
        isAuthed: 1,
        component: asyncComponent(() => import('pages/cooperator/home/index'))
    },
    {
        path: '/home',
        current: '/',
        isAuthed: 1,
        component: asyncComponent(() => import('pages/cooperator/home/index'))
    }
];

export default routes;