export default function SellerHome() {
  return (
    <main className="page">
      <h1>Seller Dashboard</h1>
      <p>Start here: manage products, categories, and orders.</p>

      <section className="cards">
        <div className="card">
          <h2>Products</h2>
          <p>Create and manage your listed items (with delivery estimate).</p>
        </div>
        <div className="card">
          <h2>Categories</h2>
          <p>Group your products into categories.</p>
        </div>
        <div className="card">
          <h2>Orders</h2>
          <p>Receive orders and update their status.</p>
        </div>
      </section>
    </main>
  )
}
