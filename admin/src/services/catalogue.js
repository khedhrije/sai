import { strapiGraphQL } from "./strapi";

/**
 * Same catalogue query style as portal
 * Returns { brands: string[], products: Product[] }
 */
export async function loadCatalogue() {
    const query = `
    query Query {
      marques {
        documentId
        Name
        categories {
          documentId
          Name
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

    const data = await strapiGraphQL(query);

    const marques = data?.marques || [];
    const brandsSet = new Set(["Tout"]);
    const products = [];

    marques.forEach((marque) => {
        if (marque?.Name) brandsSet.add(marque.Name);

        (marque?.categories || []).forEach((cat) => {
            (cat?.pieces || []).forEach((piece) => {
                const photos = piece?.Photos;
                const images = [];

                if (Array.isArray(photos) && photos.length) {
                    photos.forEach((p) => {
                        if (p?.url) images.push(p.url.startsWith("/") ? `https://cms.sai-technologie.com${p.url}` : p.url);
                    });
                } else if (photos?.url) {
                    images.push(photos.url.startsWith("/") ? `https://cms.sai-technologie.com${photos.url}` : photos.url);
                }

                if (!images.length) {
                    images.push("https://images.unsplash.com/photo-1605236453806-6ff36a86fa2e?auto=format&fit=crop&q=80&w=400");
                }

                products.push({
                    id: piece.documentId,
                    name: piece.Name,
                    description: piece.Description || "Aucune description disponible.",
                    price: piece.Price || 0,
                    stock: piece.Stock || 0,
                    brand: marque.Name || "—",
                    type: cat?.Name || "—",
                    image: images[0],
                    images,
                });
            });
        });
    });

    return { brands: Array.from(brandsSet), products };
}
