import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();

const productManager = new ProductManager('./Products.json');

router.post('/',async (req,res) => {
    const product = req.body;
    if( !product.title || !product.description || !product.code || !product.price || !product.status ||
        !product.stock || !product.category ){
        return res.status(400).send({ status: 'error', error: 'Some fields are missing' });
    }else{
        const products = await productManager.getProducts();
        const productCode = products.find ( products => products.code === product.code)
        if(productCode){
            return res.status(400).send( { status: 'error', error: `The code ${product.code} already exists`});
        }
    }
    await productManager.addProducts(product);
    const io = req.app.get('socketio');
    io.emit("showProducts", await productManager.getProducts());
    res.send({ status: 'success', payload: product });
});


router.delete('/:pid', async (req,res) => {
    const pId = Number(req.params.pid);

    const products = await productManager.getProducts();

    const index = products.findIndex(product=> product.id === pId);

    if (index !== -1){
        await productManager.deleteProduct(pId);
        const io = req.app.get('socketio');
        io.emit("showProducts", await productManager.getProducts());
        res.send({ status: 'success', payload: products });
    }else{
        res.status(404).send({ status: 'error', error: 'Product not found' });
    }
});

export default router;