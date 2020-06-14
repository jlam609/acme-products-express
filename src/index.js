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
                .then(() => console.log(`Product ${product.name} has been removed`))
                .catch(e => console.error(e))
            }}>Remove</button> </li>
            )
          })}
        </ul>
      </div>
    );
  }
}
class Create extends Component {
    constructor(){
    super()
    this.state = {
    input:''
    }
    this.add = this.add.bind(this)
    }   
    add = (e) => {
        e.preventDefault()
        this.setState({
            input:e.target.value
        })
    }
    post = (e, input) => {
        e.preventDefault()
        axios.post('/api/products', {"name":input})
        .then(() => console.log('Successfully posted'))
        .catch(e => console.error(e))
    }
    render(){
        const {input} = this.state
        return(
            <div>
                <h1>Create a Product</h1>
                <div className = {'createBar'}>
                <input onChange={(e)=>this.add(e)}></input>
                <button onClick={(e)=> this.post(e, input)}>Save</button>
                </div>
            </div>
        )
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
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/products/create">
                <Create />
            </Route>
            <Route exact={true} path="/products">
              <Products products={products} />
            </Route>
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

ReactDOM.render(<App />, app, () => console.log("rendered"));
