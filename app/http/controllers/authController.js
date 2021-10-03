

function authController()
{
    //factory func returns objects
    return {
         login(req,res)
        {
            return res.render('auth/login')
        },

        register(req,res)
        {
            return res.render('auth/register')
        }
    }
}

module.exports=authController
