"use client"
export default function NewProductPage() {
    const handleSubmit = async(e:any) => {
        const res=await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({  
                name: e.target[0].value,
                price: parseFloat(e.target[1].value),
                description: e.target[2].value,     
                image: '' // Placeholder, image upload not implemented
            })
        })
        if(res.ok){

            alert('Product added successfully');
         
        }
        window.location.reload();
    }
  return (
    <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="block mb-1 font-medium">Product Name</label>
                <input type="text" className="w-full border p-2 rounded" />
            </div>
            <div>
                <label className="block mb-1 font-medium">Price</label>
                
                <input type="number" className="w-full border p-2 rounded" />
            </div>
            <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea className="w-full border p-2 rounded"></textarea>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Add Product
            </button>
                
            </form>   
    </div>
  )
}