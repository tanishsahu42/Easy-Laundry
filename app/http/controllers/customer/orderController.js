const Order = require('../../../models/order')
const moment=require('moment')
function orderController()
{
    return {
        store(req,res)
        {
            const { time,phone, address } = req.body
            if(!time || !phone || !address)
            {
                req.flash('error','All fields are required')
                return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                time,
                phone,
                address
            })


            order.save().then(result=>
                {
                    req.flash('success','order placed')

                    delete req.session.cart

                    const eventEmitter=req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced',result)

                    
                    return res.redirect('/customer/orders')
                }).catch(err=>{
                    req.flash('error','something went wrong')
                    return res.redirect('/cart')
                })
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id },null,
                { sort: { 'time': 1 } } )
            
            res.render('customers/orders', { orders: orders,moment:moment})
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)
            // Authorize user
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order })
            }
            return  res.redirect('/')
        }
    }
}

module.exports=orderController