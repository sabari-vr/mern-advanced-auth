import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "./LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { getRecommendations } from "..";

const PeopleAlsoBought = () => {
    const [recommendations, setRecommendations] = useState([]);

    const productListQuery = useQuery({
        queryKey: ["GET_RECOMENTED_PRODUCTS_BY"],
        queryFn: () => getRecommendations(),
        enabled: true,
    });

    useEffect(() => {
        if (productListQuery.data) {
            setRecommendations(productListQuery.data)
        }
    }, [productListQuery?.data]);

    if (productListQuery.isLoading) return <LoadingSpinner />;

    return (
        <div className='mt-8'>
            <h3 className='text-2xl font-semibold text-emerald-400'>People also bought</h3>
            <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3'>
                {recommendations.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};
export default PeopleAlsoBought;