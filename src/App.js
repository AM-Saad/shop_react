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

import NotFound from './Pages/NotFound'
import Nav from './components/Layout/Nav'
import AdminNav from './components/Layout/AdminNav'
import NotificationModalProvider from './store/Notification/notification-context';
import { AdminContextProvider } from './store/Admin/admin-context';
import PrivateRoute from './components/Common/PrivateRoute'
import { UserContextProvider } from './store/User/user_context';

function App() {

  return (
    <div className="App  m-auto">
      <Switch>
        <Route path="/admin/:path?">
          <NotificationModalProvider>
            <AdminContextProvider>
              <AdminNav>
                <Switch>
                  <PrivateRoute path="/admin/products/new/">  <AddProduct /> </PrivateRoute>
                  <PrivateRoute path="/admin/products/:slug">  <Product /> </PrivateRoute>
                  <PrivateRoute path="/admin/products">  <Products /> </PrivateRoute>
                  <PrivateRoute path="/admin/category/new">  <AddCategory /> </PrivateRoute>
                  <PrivateRoute path="/admin/category/:id">  <AdminCategory /> </PrivateRoute>
                  <PrivateRoute path="/admin/category">  <Categories /> </PrivateRoute>

                  <PrivateRoute path="/admin/zones/new">  <CreateZone /> </PrivateRoute>
                  <PrivateRoute path="/admin/zones/:id">  <Zone /> </PrivateRoute>
                  <PrivateRoute path="/admin/zones">  <Zones /> </PrivateRoute>
                  <PrivateRoute path="/admin/orders/:id">  <Order /> </PrivateRoute>
                  <PrivateRoute path="/admin/orders">  <Orders /> </PrivateRoute>

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
