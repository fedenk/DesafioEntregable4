import {promises} from 'fs';


export default class ProductManager {

    constructor(path){
        this.path=path;
    }

    getProducts = async () =>{
        try{
                const data = await promises.readFile(this.path, 'utf-8')
                const products = JSON.parse(data);
                return products;
        }
        catch(error){
            console.log(error);
            return [];
        }
    }

    addProducts = async (product) => {
        try{
            const products = await this.getProducts();

            if ( products.length === 0 ){
                product.id = 1;
            }else{
                product.id = products[products.length - 1].id + 1;
            }

            products.push(product);

                await promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

                return product;
            
            }catch(error){
            console.log(error);
            return[];
            }  
        }


    deleteProduct = async (idProduct) => {
        try{
            let products = await this.getProducts();

            const productFilter = products.filter(product => product.id !== idProduct);

            products = productFilter;

            await promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

            return(products);
        }

        catch(error){
            console.log(error);
        }
    }

}