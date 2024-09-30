import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateProductForm from '../components/CreateProductForm'
import ProductsList from '../components/ProductsList'
import AnalyticsTab from '../components/AnalyticsTab'
import EditProductForm from '../components/EditProductForm'
import AdminLayout from '../layout/AdminLayout'

const AdminRoutes = () => {
    return (
        <AdminLayout>
            <Routes>
                <Route path="/" element={<h1>Admin</h1>} />
                <Route path="/create-product" element={<CreateProductForm />} />
                <Route path="/products" element={<ProductsList />} />
                <Route path="/products/:id" element={<EditProductForm />} />
                <Route path="/analytics" element={<AnalyticsTab />} />
            </Routes>
        </AdminLayout>
    )
}

export default AdminRoutes
