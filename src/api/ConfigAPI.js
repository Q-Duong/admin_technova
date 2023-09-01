import axios from 'axios'

const axi = axios.create({
  baseURL: `https://api.technova.com.vn`,
});

const authAPI = {
  login: (data) =>
  axi.post(`/v1/auth/login-admin`, data, {
    headers: {
      'Content-Type': `application/json`,
    },
  }),
}
const imageAPI = {
  create: (formData, token) =>
    axi.post(`/v1/image`, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        'Authorization': `Bearer ${token}`
      },
    }),
  delete: (id, token) => axi.delete(`/v1/image/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }), 
}
const categoryAPI = {
  getAll: (query, token) => axi.get(`/v1/category?queryType=activate&${query}`,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),
  create: (createCategory, token) =>
    axi.post(`/v1/category`, createCategory, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
  update: (updateCategory, token) =>
    axi.put(`/v1/category/${updateCategory.id}`, updateCategory, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
  delete: (id, token) => axi.delete(`/v1/category/${id}`,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),
};
const productAPI = {
  getAll: (query, token) => axi.get(`/v1/product/?queryType=activate&${query}`,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),
  create: (createProduct, token) =>
    axi.post(`/v1/product`, createProduct, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
  update: (updateProduct, token) =>
    axi.put(`/v1/product/${updateProduct.id}`, updateProduct, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
  delete: (id, token) => axi.delete(`/v1/product/${id}`,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),
  getPackages: (id,token) => axi.get(`/v1/product/${id}/package`,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),
  getBenefits: (id, token) => axi.get(`/v1/product/${id}/benefit`,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),

};

const brandAPI = {
  getAll: (query, token) => axi.get(`/v1/brand?queryType=activate&${query}`,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),
  create: (createBrand, token) =>
    axi.post(`/v1/brand`, createBrand, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
  update: (updateBrand, token) =>
    axi.put(`/v1/brand/${updateBrand.id}`, updateBrand, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
  delete: (id, token) => axi.delete(`/v1/brand/${id}`,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),
};

const bannerAPI = {
  getAll: (token) => axi.get(`/v1/banner`,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),
  create: (createBanner, token) =>
    axi.post(`/v1/banner`, createBanner, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
  update: (updateBanner, token) =>
    axi.put(`/v1/banner/${updateBanner.id}`, updateBanner, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
  delete: (id, token) => axi.delete(`/v1/banner/${id}`,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),
};

const userAPI = {
  getAll: (query, token) => axi.get(`/v1/user?queryType=activate&${query}`,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),
  delete: (id, token) => axi.delete(`/v1/user/${id}`,{
    headers: {
      'Content-Type': `application/json`,
      'Authorization': `Bearer ${token}`
    },
  }),
};

const employeeAPI = {
  getAll: (query, token) => axi.get(`/v1/employee?queryType=activate&${query}`,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),
  create: (createEmployee, token) =>
    axi.post(`/v1/employee`, createEmployee, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
  update: (updateEmployee, token) =>
    axi.put(`/v1/employee/${updateEmployee.id}`, updateEmployee, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
  delete: (id, token) => axi.delete(`/v1/employee/${id}`,{
    headers: {
      'Content-Type': `application/json`,
      'Authorization': `Bearer ${token}`
    },
  }),
};

const productPackageAPI = {
  create: (createProductPackage, token) =>
    axi.post(`/v1/product-package`, createProductPackage, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
    update: (updateProductPackage, token) =>
    axi.put(`/v1/product-package/${updateProductPackage.id}`, updateProductPackage, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
    delete: (id, token) =>
    axi.delete(`/v1/product-package/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }),
};

const productBenefitAPI = {
  create: (createProductBenefit, token) =>
    axi.post(`/v1/product-benefit`, createProductBenefit, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
    delete: (id, token) =>
    axi.delete(`/v1/product-benefit/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }),
};

const benefitValueAPI = {
  update: (updateBenefitValue, token) =>
    axi.put(`/v1/benefit-value/${updateBenefitValue.id}`, updateBenefitValue, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
}

const newsAPI = {
  getAll: (query, token) => axi.get(`/v1/news?queryType=activate&${query}`,{
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }),
  create: (createNews, token) =>
    axi.post(`/v1/news`, createNews, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
  update: (updateNews, token) =>
    axi.put(`/v1/news/${updateNews.id}`, updateNews, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
  delete: (id, token) => axi.delete(`/v1/news/${id}`,{
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }),
};

const aboutCompanyAPI = {
  getAll: (query, token) => axi.get(`/v1/about-company?queryType=activate&${query}`,{
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }),
  create: (createAboutCompany, token) =>
    axi.post(`/v1/about-company`, createAboutCompany, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
  update: (updateAboutCompany, token) =>
    axi.put(`/v1/about-company/${updateAboutCompany.id}`, updateAboutCompany, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
  delete: (id, token) => axi.delete(`/v1/about-company/${id}`,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),
};

const technovaServiceAPI = {
  getAll: (query, token) => axi.get(`/v1/technova-service?queryType=activate&${query}`,{
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }),
  create: (createTechnovaService, token) =>
    axi.post(`/v1/technova-service`, createTechnovaService, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
  update: (updateTechnovaService, token) =>
    axi.put(`/v1/technova-service/${updateTechnovaService.id}`, updateTechnovaService, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
  delete: (id, token) => axi.delete(`/v1/technova-service/${id}`,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),
};

const solutionAPI = {
  getAll: (query, token) => axi.get(`/v1/solution?queryType=activate&${query}`,{
    'Authorization': `Bearer ${token}`
  }),
  create: (createSolution, token) =>
    axi.post(`/v1/solution`, createSolution, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
  update: (updateSolution, token) =>
    axi.put(`/v1/solution/${updateSolution.id}`, updateSolution, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
    }),
  delete: (id, token) => axi.delete(`/v1/solution/${id}`,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),
};

const orderAPI = {
  getAll: (query, token) => axi.get(`/v1/order?queryType=activate&${query}`,{
    headers: {
      "Authorization": `Bearer ${token}`
    }
  }),
  update: (data, token) => axi.put(`/v1/order/${data.id}`, data, {
    headers: {
      'Content-Type': `application/json`,
      "Authorization": `Bearer ${token}`

    }
  }),
  delete: (id, token) => axi.delete(`/v1/order/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  }),
  create: (order, token) => {
    return axi.post(`/v1/order`,order,{
      headers: {
        'Content-Type': `application/json`,
        "Authorization": `Bearer ${token}`

      }
    })
  },
}

const statisticAPI = {
  getAll: (token) => axi.get('/v1/statistic',{
    headers: {
      "Authorization": `Bearer ${token}`
    }
  }),
}


const notificationAPI = {
  getAll: (query, token) => axi.get(`/v1/notification?${query}`,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),
  update: (id, token) => axi.patch(`/v1/notification/${id}`,{}, {
    headers: {
      'Content-Type': "application/json",
      'Authorization': `Bearer ${token}`
    }
  })
}

export {
  notificationAPI,
  userAPI,
  brandAPI,
  productAPI,
  categoryAPI,
  imageAPI,
  productPackageAPI,
  productBenefitAPI,
  benefitValueAPI,
  newsAPI,
  aboutCompanyAPI,
  solutionAPI,
  orderAPI,
  statisticAPI,
  authAPI,
  employeeAPI,
  technovaServiceAPI,
  bannerAPI
};
