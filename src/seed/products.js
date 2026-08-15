const products = [
  {
    name: "Remera Essential Blanca",
    description: "Remera básica confeccionada en algodón premium de corte regular.",
    price: 24999,
    stock: 25,
    category: "remera",
    gender: "hombre",
    images: [
      {
        url: "https://res.cloudinary.com/lr2opxzi/image/upload/v1786317200/remera-blanca.jpg",
        publicId: "remera-blanca",
      },
    ],
    unitsSold: 185,
  },

  {
    name: "Remera Oversize Negra",
    description: "Remera oversize de algodón pesado con cuello reforzado.",
    price: 28999,
    stock: 18,
    category: "remera",
    gender: "hombre",
    images: [
      {
        url: "https://res.cloudinary.com/lr2opxzi/image/upload/v1786317209/remera_negra.jpg",
        publicId: "remera-negra",
      },
    ],
    unitsSold: 243,
  },

  {
    name: "Jean Slim Fit Azul",
    description: "Jean elastizado de corte slim fit para uso diario.",
    price: 69999,
    stock: 20,
    category: "pantalon",
    gender: "hombre",
    images: [
      {
        url: "https://res.cloudinary.com/lr2opxzi/image/upload/v1786317206/jeans.jpg",
        publicId: "jeans",
      },
    ],
    unitsSold: 94,
  },

  {
    name: "Buzo Hoodie Beige",
    description: "Buzo con capucha y bolsillo canguro confeccionado en frisa.",
    price: 54999,
    stock: 14,
    category: "abrigo",
    gender: "mujer",
    images: [
      {
        url: "https://res.cloudinary.com/lr2opxzi/image/upload/v1786317200/hoodie-beige.jpg",
        publicId: "hoodie-beige",
      },
    ],
    unitsSold: 121,
  },

  {
    name: "Buzo Oversize Gris",
    description: "Buzo oversize de frisa premium con interior afelpado.",
    price: 59999,
    stock: 11,
    category: "abrigo",
    gender: "unisex",
    images: [
      {
        url: "https://res.cloudinary.com/lr2opxzi/image/upload/v1786317203/buzo-gris.jpg",
        publicId: "buzo-gris",
      },
    ],
    unitsSold: 87,
  },

  {
    name: "Campera Denim Celeste",
    description: "Campera de jean clásica con botones metálicos.",
    price: 89999,
    stock: 10,
    category: "abrigo",
    gender: "mujer",
    images: [
      {
        url: "https://res.cloudinary.com/lr2opxzi/image/upload/v1786317206/campera-celeste.jpg",
        publicId: "campera-celeste",
      },
    ],
    unitsSold: 72,
  },

  {
    name: "Zapatillas Urban White",
    description: "Zapatillas urbanas de cuero sintético con suela de goma.",
    price: 84999,
    stock: 15,
    category: "calzado",
    gender: "unisex",
    images: [
      {
        url: "https://res.cloudinary.com/lr2opxzi/image/upload/v1786317207/zapatillas-blancas.jpg",
        publicId: "zapatillas-blancas",
      },
    ],
    unitsSold: 98,
  },

  {
    name: "Botas Chelsea Negras",
    description: "Botas estilo Chelsea confeccionadas en cuero ecológico.",
    price: 109999,
    stock: 9,
    category: "calzado",
    gender: "mujer",
    images: [
      {
        url: "https://res.cloudinary.com/lr2opxzi/image/upload/v1786317202/zapatos-negros.jpg",
        publicId: "zapatos-negros",
      },
    ],
    unitsSold: 54,
  },

  {
    name: "Gorra Clothy Black",
    description: "Gorra de algodón con logo bordado.",
    price: 19999,
    stock: 30,
    images: [
      {
        url: "https://res.cloudinary.com/lr2opxzi/image/upload/v1786317213/gorra-negra.jpg",
        publicId: "gorra-negra",
      },
    ],
    category: "accesorios",
    gender: "unisex",
    unitsSold: 156,
  },

  {
    name: "Pack Medias Clásicas x3",
    description: "Pack de tres pares de medias de algodón reforzado.",
    price: 12999,
    stock: 40,
    category: "accesorios",
    gender: "unisex",
    images: [
      {
        url: "https://res.cloudinary.com/lr2opxzi/image/upload/v1786317205/pack-medias.jpg",
        publicId: "pack-medias",
      },
    ],
    unitsSold: 214,
  },
];

export default products;
