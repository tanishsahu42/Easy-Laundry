
const User=require('../../models/user')
const bcrypt=require('bcrypt')
const passport = require('passport')
function authController()
{
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }
    //factory func returns objects
    return {
         login(req,res)
        {
            return res.render('auth/login')
        },


        postLogin(req,res,next)
        {
            passport.authenticate('local', (err, user, info) => {
                if(err) {
                    req.flash('error', info.message )
                    return next(err)
                }
                if(!user) {
                    req.flash('error', info.message )
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err) {
                        req.flash('error', info.message ) 
                        return next(err)
                    }

                    return res.redirect(_getRedirectUrl(req))
                })
            })(req, res, next)
        },

        register(req,res)
        {
            return res.render('auth/register')
        },

        async postRegister(req,res)
        {
            const{name,email,password}=req.body

            if(!name || !email || !password)
            {
                req.flash('error','All fields are required')
                return res.redirect('/register')
            }

            User.exists({email:email},(err,result)=>
            {
                if(result)
                {
                    req.flash('error','Email already exist')
                    return res.redirect('/register')
                }
            })

            const hashpassword=await bcrypt.hash(password,10)
            const user=new User({
                name:name,
                email:email,
                password:hashpassword
            })



            user.save().then((user)=>
            {
                return res.redirect('/')
            }).catch(err=>
                {
                    req.flash('error','something went wrong')
                    return res.redirect('/register')
                })
            

            console.log(req.body)
        },
        logout(req, res) {
            req.logout()
            return res.redirect('/login')  
          }  
    }
}

module.exports=authController
