// ** Icons Import
import { Home, Plus, Grid } from 'react-feather'
import { app_url } from '@src/common/Helpers'
export default [
  {
    id: 'dashboards',
    title: 'Dashboard',
    icon: <Home size={20} />,
    navLink: app_url+'/dashboard',
  },
  {
    header: 'Product Manage'
  },
  {
    id: 'supplierform',
    title: 'Supplier Form',
    icon: <Grid size={20} />,
    navLink: app_url+'/supplierform',
  },
  {
    id: 'slipgeneration',
    title: 'Slip Generation',
    icon: <Plus size={20} />,
    navLink: app_url+'/slipgeneration',
  },
  
]