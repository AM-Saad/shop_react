import './App.css';
import { Route, Switch } from 'react-router-dom'

import Login from './Pages/Login.tsx'
// import SignUp from './Pages/Signup'
import Shop from './Pages/Shop'
import AdminLogin from './Pages/Admin/Login'
import Products from './Pages/Admin/Product/Products'
import Product from './Pages/Admin/Product/Product'
import AddProduct from './Pages/Admin/Product/AddProduct'
import ProductDetail from './Pages/ProductDetail'
import AddCategory from './Pages/Admin/Category/AddCategory'
import Categories from './Pages/Admin/Category/Categories'
import Category from './Pages/Admin/Category/Category'

import NotFound from './Pages/NotFound'
import Nav from './components/Layout/Nav'
import AdminNav from './components/Layout/AdminNav'
import NotificationModalProvider from './store/Notification/notification-context';
import { AdminContextProvider } from './store/Admin/admin-context';
import PrivateRoute from './components/Common/PrivateRoute'
import { UserCotextProvider } from './store/User/user_context';

function App() {


  return (
    <div className="App  m-auto min-h-screen">


      <Switch>


        <Route exact path="/admin/:path?">
          <NotificationModalProvider>
            <AdminContextProvider>
              <AdminNav>
                <Switch>
                  <PrivateRoute exact path="/admin/products/new/">  <AddProduct /> </PrivateRoute>
                  <PrivateRoute exact path="/admin/products/:slug">  <Product /> </PrivateRoute>
                  <PrivateRoute exact path="/admin/products">  <Products /> </PrivateRoute>
                  <PrivateRoute path="/admin/category/new">  <AddCategory /> </PrivateRoute>
                  <PrivateRoute path="/admin/category/:id">  <Category /> </PrivateRoute>
                  <PrivateRoute path="/admin/category">  <Categories /> </PrivateRoute>
                  <Route exact path="/admin/login">  <AdminLogin /> </Route>
                </Switch>
              </AdminNav>
            </AdminContextProvider>
          </NotificationModalProvider>
        </Route>

        <Route  exact>
          <UserCotextProvider>
            <Nav>
              <Switch>
                <Route exact path='/products/:slug' component={ProductDetail} />
                <Route exact path='/' component={Shop} />
                <Route exact path='/shop' component={Shop} />
                <Route exact path='/login' component={Login} />
              </Switch>
            </Nav>
          </UserCotextProvider>

        </Route>
        <Route path="*">
          <NotFound />
        </Route>

      </Switch>
      {/* <Switch>
        <Route exact path="/login" render={() => (<Login />)} />
        <Route exact path="/signup" render={() => (
          !ctx.isLoggedIn ? (
            <SignUp />
          ) : (
            <Redirect to="/" />
          )
        )} />
        <Route exact path="/" component={Shop}  >
          <Shop />
        </Route>
        <Route exact path="/shop" component={Shop}  >
          <Shop />
        </Route>

        <Route exact path="/product/:slug" component={ProductDetail}  >
          <ProductDetail />
        </Route>

        <NotificationModalProvider>
          <AdminContextProvider>
            <Route exact path="/admin/login/" component={Login} ><Login /></Route>
            <PrivateRoute path="/admin/products/">  <Products /> </PrivateRoute>
            <PrivateRoute path="/admin/products/:slug">  <Product /> </PrivateRoute>
            <PrivateRoute path="/admin/products/new">  <AddProduct /> </PrivateRoute>
            <PrivateRoute path="/admin/category/new">  <AddCategory /> </PrivateRoute>
            <PrivateRoute path="/admin/category">  <Categories /> </PrivateRoute>
            <PrivateRoute path="/admin/category/:id">  <Category /> </PrivateRoute>

            <Route path='/admin/:path?' exact>
              <AdminNav>
                <Switch>
                  <Route exact path='/admin/products' component={Products} />
                  <Route exact path='/admin/products/:slug' component={Product} />
                  <Route exact path='/admin/category' component={Categories} />
                  <Route exact path='/admin/category/:id' component={Category} />

                </Switch>
              </AdminNav>
            </Route>
          </AdminContextProvider>

        </NotificationModalProvider >
        <Route path="*">
          <NotFound />
        </Route>
      </Switch >  */}





    </div >
  );
}

export default App;
