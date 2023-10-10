import { Router } from "express";
import ProductManager from '../managers/ProductManager.js';

const productManager = new ProductManager('./Products.json');


const router = Router();


router.get('/realtimeproducts', async (req,res) => {
    
    const products = await productManager.getProducts();
    
    if(products.length === 0){
        res.status(404).send({ status: 'error', error: 'File not found' });
    }else{
        const productLimit = [];
        const limit = req.query.limit;
        if(!limit){
            return res.render('realTimeProducts', { products });
        }
        else if(limit <= products.length){
            for (let i = 0; i < limit; i++) {
                const product = products[i];
                productLimit.push(product);
            }
            return res.render('realTimeProducts', { productLimit } );
        }
        else{
            res.status(400).send({ status: 'error', error: 'Ha superado el limite de productos' });
        }
    }
    
});

router.get('/', async(req,res) =>{
    const products = await productManager.getProducts();
    res.render('home', { products });
})

export default router;