import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { Switch, HashRouter, Link, Route } from "react-router-dom";
import axios from "axios";

const app = document.getElementById("app");

class Home extends Component {
  render() {
    return <h1>Welcome to HashRouter</h1>;
  }
}
class Products extends Component {
  render() {
    const { products } = this.props;
    return (
      <div className = 'products'>
        <h1>Products</h1>
        <ul className = 'list'>
          {products.map((product) => {
            return (
            <li key = {product.name}>{product.name} <button onClick = {(e) => {
                e.preventDefault()
                axios.delete(`/api/products/${product.name}`)
            }}>Remove</button> </li>
            )
          })}
        </ul>
      </div>
    );
  }
}
class App extends Component {
  state = {
    products: [],
    loading: true,
  };
  componentDidMount() {
    axios.get("/api/products").then((res) => {
      this.setState({
        products: res.data.products,
        loading: false,
      });
    });
  }
  render() {
    const { products, loading } = this.state;
    console.log(products);
    if (loading) return <h1>Loadingg.....</h1>;
    return (
      <div>
        <HashRouter>
          <h1> Acme Products</h1>
          <nav className={"tabs"}>
            <Link to="/home">Home</Link>
            <Link to="/products">Products ({products.length})</Link>
            <Link to="/products/create">Create a Product</Link>
          </nav>
          <Switch>
            <Route path={"/home"}>
              <Home />
            </Route>
            <Route path={"/products"}>
              <Products products={products} />
            </Route>
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

ReactDOM.render(<App />, app, () => console.log("rendered"));
