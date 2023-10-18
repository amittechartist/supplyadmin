import { lazy } from 'react'
import { app_url } from '@src/common/Helpers'
const DashboardEcommerce = lazy(() => import('../../views/dashboard/ecommerce'))
const ProductView = lazy(() => import('../../views/product/productview'))
const Catagory = lazy(() => import('../../views/catagory'))
const Payoutcustomer = lazy(() => import('../../views/payoutcustomer'))
const Product = lazy(() => import('../../views/product'))
const Payments = lazy(() => import('../../views/payments'))
const Ewaybillgenerate = lazy(() => import('../../views/ewaybillgenerate'))
const Ewaybilllist = lazy(() => import('../../views/ewaybillgenerate/list'))
const DashboardRoutes = [
  // {
  //   path: '/dashboard/analytics',
  //   element: <DashboardAnalytics />
  // },
  {
    path: app_url+'/dashboard',
    element: <DashboardEcommerce />
  },
  {
    path: app_url+'/supplierform',
    element: <Catagory />
  },
  {
    path: app_url+'/slipgeneration',
    element: <Product />
  },
  {
    path: app_url+'/viewproduct/:pid',
    element: <ProductView/>
  },
  {
    path: app_url+'/payout_customer',
    element: <Payoutcustomer />
  }, 
  {
    path: app_url+'/payments',
    element: <Payments />
  }, 
  {
    path: app_url+'/ewaybillgenerate',
    element: <Ewaybillgenerate />
  }, 
  {
    path: app_url+'/ewaybilllist',
    element: <Ewaybilllist />
  }, 

]

export default DashboardRoutes
