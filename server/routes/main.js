const express = require("express")
const router = express.Router()
const post = require("../models/post")


//Post Method example to test mongod

/* function PostMethod (){
    post.insertMany([
        {
            title:"NodeJs Blog",
            body:"The description of blog"
        }
    ])
}
PostMethod() */



router.get("", async (req, res)=>{
    const locals = {
        title:"node js blog",
        description:"Simple nodejs blog with express and mongodb"
    }
    try{
        let pages = 10;
        let currentpage = req.query.perpage || 1;

        const data = await post.aggregate([{$sort : {createdAt:-1}}])
        .skip(pages * currentpage - pages)
        .limit(pages)
        .exec()
        const count = await post.countDocuments({})
        const nextpage = parseInt(currentpage) + 1
        const hasnextpage = nextpage <= Math.ceil(count/pages)
        res.render('index', {locals, data, current:currentpage, next:hasnextpage?nextpage:null});
    }catch(error){
        console.log(error)
    }
})


//post/:id single posts getting

router.get('/post/:id', async (req, res)=>{
try{
    let slug = req.params.id;
    const data = await post.findById({_id:slug})
    const locals = {
        title:data.title,
        description:"Simple nodejs blog with express and mongodb"
    }

res.render('posts', {locals, data, currentRoute:`/post/${slug}`})
}catch(error){
    console.log(error)
}
})


router.post('/search', async(req, res)=>{
    try{
        const searchedTerm = req.body.searchTerm;
        const serchregexp = searchedTerm.replace(/[^a-zA-Z0-9 ]/g, "")
        const locals = {
            title:'search',
            body:"searched value here"
        }

        const data= await post.find({
            $or:[
                {title: {$regex: new RegExp(serchregexp, 'i')}},
                {body:{$regex: new RegExp(serchregexp, 'i')}}
            ]
        })

        res.render(
            "search",{
                data,
                locals,
                currentRoute:'/'
            }
        )

    }catch(error){
        console.log(error);
    }
})


router.get('/about',(req, res)=>{
res.render('about', {currentRoute:'/about'})
})
module.exports = router;