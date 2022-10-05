import './App.css';
import { Route, Switch } from 'react-router-dom'

import Login from './Pages/Shop/Login.tsx'
import Shop from './Pages/Shop/Shop'
import Category from './Pages/Shop/Category'
import Checkout from './Pages/Shop/Checkout'
import AdminLogin from './Pages/Admin/Login'
import Products from './Pages/Admin/Product/Products'
import Product from './Pages/Admin/Product/Product'
import AddProduct from './Pages/Admin/Product/AddProduct'
import ProductDetail from './Pages/Shop/ProductDetail'
import AddCategory from './Pages/Admin/Category/AddCategory'
import Categories from './Pages/Admin/Category/Categories'
import AdminCategory from './Pages/Admin/Category/Category'
import CreateZone from './Pages/Admin/Zones/CreateZone'
import Zones from './Pages/Admin/Zones/Zones'
import Zone from './Pages/Admin/Zones/Zone.tsx'
import Orders from './Pages/Admin/Orders/Orders'
import Order from './Pages/Admin/Orders/Order.tsx'
import Setting from './Pages/Admin/Settings/index.tsx'

import NotFound from './Pages/NotFound'
import Nav from './components/Layout/Nav'
import AdminNav from './components/Layout/AdminNav'
import NotificationModalProvider from './store/Notification/notification-context';
import { AdminContextProvider } from './store/Admin/admin-context';
import PrivateRoute from './components/Common/PrivateRoute'
import ContextPrivateRoute from './components/Common/ContextPrivateRoute'
import { UserContextProvider } from './store/User/user_context';
import { ProductsContextProvider } from './store/Admin/products-context';
import { OrdersContextProvider } from './store/Admin/orders-context';
import { ZonesContextProvider } from './store/Admin/zones-context';


function App() {

  return (
    <div className="App  m-auto">
      <Switch>
        <Route path="/admin/:path?">
          <NotificationModalProvider>
            <AdminContextProvider>
              <AdminNav>

                <Switch>

                  <ContextPrivateRoute path="/admin/products/create/" Provider={ProductsContextProvider} component={AddProduct} />
                  <ContextPrivateRoute path="/admin/products/:slug" Provider={ProductsContextProvider} component={Product} />
                  <ContextPrivateRoute path="/admin/products" Provider={ProductsContextProvider} component={Products} />
                  {/* <ProductsContextRoute>  <PrivateRoute path="/admin/products/:slug">  <Product /> </PrivateRoute></ProductsContextRoute> */}
                  {/* <ProductsContextRoute>  <PrivateRoute path="/admin/products">  <Products /> </PrivateRoute></ProductsContextRoute> */}

                  <PrivateRoute path="/admin/category/create">  <AddCategory /> </PrivateRoute>
                  <PrivateRoute path="/admin/category/:id">  <AdminCategory /> </PrivateRoute>
                  <PrivateRoute path="/admin/category">  <Categories /> </PrivateRoute>

                  <ContextPrivateRoute path="/admin/zones/create" Provider={ZonesContextProvider} component={CreateZone} />
                  <ContextPrivateRoute path="/admin/zones/:id" Provider={ZonesContextProvider} component={Zone} />
                  <ContextPrivateRoute path="/admin/zones" Provider={ZonesContextProvider} component={Zones} />

                  <ContextPrivateRoute path="/admin/orders/:id" Provider={OrdersContextProvider} component={Order} />
                  <ContextPrivateRoute path="/admin/orders/" Provider={OrdersContextProvider} component={Orders} />
                  <PrivateRoute path="/admin/settings" ><Setting /> </PrivateRoute>

                  <Route path="/admin/login">  <AdminLogin /> </Route>
                </Switch>
              </AdminNav>
            </AdminContextProvider>
          </NotificationModalProvider>
        </Route>

        <Route  >
          <UserContextProvider>
            <Nav>
              <Switch>
                <Route path='/category/:name' component={Category} />
                <Route path='/checkout/' component={Checkout} />
                <Route path='/products/:slug' component={ProductDetail} />
                <Route path='/' component={Shop} />
                <Route path='/shop' component={Shop} />
                <Route path='/login' component={Login} />
              </Switch>
            </Nav>
          </UserContextProvider>

        </Route>
        <Route path="*">
          <NotFound />
        </Route>

      </Switch>

    </div >
  );
}

export default App;
