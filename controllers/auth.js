const path=require('path');
const user=require('../models/user');
const bcrypt=require('bcryptjs')
const nodemailer=require('nodemailer');
const crypto=require('crypto');
const sendgridtransport=require('nodemailer-sendgrid-transport');
const transporter=nodemailer.createTransport(sendgridtransport({
  auth:{
    api_key:sand_gid
  }
}));
exports.getlogin=(req,res,next)=>{
  let message=req.flash('error');
  if (message.length>0){
    message=message[0];
  }
  else message=null;
    res.render('auth/login',{
        path:'/login',
        pageTitle:'Login',
       // errorMessage:"nvalid email or password",
       errorMessage:message
       
    });
};
exports.postlogin=(req,res,next)=>{
    const email= req.body.email;
    const password= req.body.password;
    user.findOne({email:email})
    .then(user=>{
        if(!user){
            req.flash('error','Invalid email or password');
            return res.redirect('/login');
        };
      bcrypt.compare(password,user.password)
      .then(match=>{
        if (match){
            req.session.user=user;
            req.session.islogged=true;
            console.log( req.session.user);
             req.session.save(err=>{
              
                console.log("session started");
              });
              if (req.session.views) {
                req.session.views++;
             console.log(`Views: ${req.session.views}`);
            } else {
                req.session.views = 1;
                console.log('First visit');
            }
              return  res.redirect('/home');
           
           
        };
        req.flash('error','Invalid email or password');
        return res.redirect('/login');
      })
        .catch(err=>{
   console.log(err);
    });

   
})  
.catch(err=>{
    console.log(err);
     });};
exports.getsignup=(req,res,next)=>{
   
    let message=req.flash('error');
    if (message.length>0){
      message=message[0];
    }
    else message=null;
      res.render('auth/signup',{
          path:'/signup',
          pageTitle:'Signup',
         // errorMessage:"nvalid email or password",
         errorMessage:message
         
      });
};
exports.postsignup=(req,res,next)=>{
    const name=req.body.name;
   const email=req.body.email;
   const password=req.body.password;
   const confirmpassword=req.body.confirmpassword;
   user.findOne({email:email}).then(userDoc=>{
    if (userDoc){
        req.flash('error','Email exists already ,please try with another one');
        
        return res.redirect('/signup');
    }
    return bcrypt.hash(password,12) .then(hashedpassword=>{
        const newuser=new user({
            name:name,
            email:email,
            password:hashedpassword,
            farm:[]
           });
           return newuser.save();
       })
       .then(result=>{
        res.redirect('/login');
       return transporter.sendMail({
          to:email,
          from:'eman.20377392@compit.aun.edu.eg',
          subject:'sign Up successfully',
          html:'<h1>hi you suuccessfully signed up!</h1>'
        });
     
       }).catch(err=>{
        console.log(err);
       });
   
   })
   .catch(err=>{
    console.log(err);
   })
};
exports.postlogout=(req,res,next)=>{
   req.session.destroy(err=>{
   console.log(err);
   res.redirect('/');
});
};
exports.getReset=(req,res,next)=>{
  let message=req.flash('error');
  if (message.length>0){
    message=message[0];
  }
  else message=null;
    res.render('auth/forgetPass',{
        path:'/reset',
        pageTitle:'Reset Password',
       // errorMessage:"nvalid email or password",
       errorMessage:message
       
    });
};
exports.postReset=(req,res,next)=>{
  const email=req.body.email;
  var token;
  user.findOne({email:email}).then(user=>{

       if (!user){
    req.flash('error',"Invalid email ")
    return res.redirect('reset');
        }

  crypto.randomBytes(12,(err,buffer)=>{
        if (err){
     return  res.redirect('reset');
                                    }

    token=buffer.toString('hex');
   
    user.resetToken=token;
    user.tokenExpiration=Date.now()+3600000;
     user.save();
      transporter.sendMail({
      to:email,
      from:'eman.20377392@compit.aun.edu.eg',
      subject:'Reset Password',
      html:`
      <p>hi, Now you can reset your password <p>
      please follow this link to reset your password 
      <a href="http://localhost:3000/reset/${token}"> follow this link</a>`
    });
  })
  })
  .then(re=>{
    res.redirect('/new-pass');
  })
  .catch(err=>{
    console.log(err);
  })
};
exports.getNewPass=(req,res,next)=>{
  const token=req.params.token;
  user.findOne({resetToken:token, tokenExpiration:{$gt:Date.now()}})
  .then(user=>{
    if (!user){
      res.redirect('/reset')
    }
  
  let message=req.flash('error');
  if (message.length>0){
    message=message[0];
  }
  else message=null;
    res.render('auth/newpass',{
        path:'/new-pass',
        pageTitle:'New Password',
       // errorMessage:"nvalid email or password",
       errorMessage:message,
       user_id:user._id.toString(),
       token:token
    });
  }).catch(err=>{
    console.log(err);
  })
};
exports.postNewPass=(req,res,next)=>{
  const userid=req.body.userId;
  const token=req.params.token;
  const password=req.body.password;
  const confirmpassword=req.body.confirmpassword;
  if (password!=confirmpassword){
    req.flash('error','password not confirmed ,please try again');
    return res.redirect(`/reset/${token}`);
  }
  user.findOne({resetToken:token}).then(uuser=>{
   bcrypt.hash(password,12).then(hashedpass=>{
   console.log(token);
    uuser.tokenExpiration=Date.now();
    uuser.password=hashedpass;})
    return uuser.save();
  })
  .then(result=>{
  
    res.redirect('/confirmed');
  }).catch(err=>{
    console.log(err);
  });
};
exports.getconfirmed=(req,res,next)=>{
  res.render('auth/confirmed',{
    path:'/confirmed',
        pageTitle:'confirm password',
  });
};
exports.newpass=(req,res,next)=>{
  res.render('auth/newpassdone',{
    path:'/',
        pageTitle:'newpass',
  });
};