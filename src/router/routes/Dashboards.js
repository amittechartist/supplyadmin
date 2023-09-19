import { lazy } from 'react'
import { app_url } from '@src/common/Helpers'
const DashboardEcommerce = lazy(() => import('../../views/dashboard/ecommerce'))
const ProductView = lazy(() => import('../../views/product/productview'))
const Catagory = lazy(() => import('../../views/catagory'))
const Product = lazy(() => import('../../views/product'))

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
  
]

export default DashboardRoutes
