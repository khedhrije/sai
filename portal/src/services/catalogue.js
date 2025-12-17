import { API_BASE_URL } from "../app/config";
import { gql } from "./strapi";

export const loadCatalogue = async () => {
    const query = `
    query Query {
      marques {
        documentId
        Name
        Description
        Logo { url }
        categories {
          documentId
          Name
          Description
          Logo { url }
          pieces {
            documentId
            Name
            Description
            Price
            Stock
            Photos { url }
          }
        }
      }
    }
  `;

    const data = await gql(query);
    const marquesData = data?.marques || [];

    const brands = new Set(["Tout"]);
    const products = [];

    marquesData.forEach((marque) => {
        if (marque?.Name) brands.add(marque.Name);

        marque?.categories?.forEach((category) => {
            category?.pieces?.forEach((piece) => {
                let images = [];
                const defaultImage =
                    "https://images.unsplash.com/photo-1605236453806-6ff36a86fa2e?auto=format&fit=crop&q=80&w=400";

                const photos = piece?.Photos;

                if (Array.isArray(photos) && photos.length > 0) {
                    images = photos.map((p) => {
                        let url = p?.url || "";
                        if (url.startsWith("/")) url = `${API_BASE_URL}${url}`;
                        return url;
                    });
                } else if (photos?.url) {
                    let url = photos.url;
                    if (url.startsWith("/")) url = `${API_BASE_URL}${url}`;
                    images.push(url);
                }

                if (images.length === 0) images.push(defaultImage);

                products.push({
                    id: piece.documentId,
                    name: piece.Name,
                    description: piece.Description || "Aucune description disponible.",
                    price: piece.Price || 0,
                    stock: piece.Stock || 0,
                    brand: marque.Name,
                    type: category.Name,
                    image: images[0],
                    images,
                    rating: 5,
                });
            });
        });
    });

    if (!brands.has("Universel")) brands.add("Universel");

    return { brands: Array.from(brands), products };
};
