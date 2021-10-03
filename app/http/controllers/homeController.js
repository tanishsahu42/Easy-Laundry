
const Menu=require('../../models/menu')

function homeController()
{
    //factory func returns objects
    return {
       async index(req,res)
        {
            const clothes=await Menu.find()
            console.log(clothes)
            return res.render('home',{clothes:clothes})
            
        }
    }
}

module.exports=homeController
