var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

function initIncidentes(db){
    var incidentesColl = db.collection('incidentes');
    router.get('/', (req,res,next)=>{
       incidentesColl.find().toArray((err,incidentes)=>{
           if(err){
               console.log(err);
               return res.status(404).json({"error":"Error al tratar de extraer"});
           }
           return res.status(200).json(incidentes);
       });  
    });
    router.get('/:id', (req,res,next)=>{
        var id = new ObjectID(req.params.id);
        incidentesColl.findOne({"_id":id} , (err,doc) => {
            if(err){
                console.log(err);
                return res.status(404).json({"error": "No se puedo obtener"});

            }
            return res.status(200).json(doc);
        }); 
    });

    router.post('/', (req, res, next)=>{
        var newIncidente = Object.assign({}, 
         {
            "descripcion":"",
            "fechaYHora":new Date().getTime(),
            "tipo":"" ,
            "estado":"",
            "usuarioRegistra":"",
            "usuarioAsignado":"",
            "fechaHoraAsignado": new Date().getTime(),
            "fechaHoraCerrado": new Date().getTime(),
         },
         req.body
         ); 
         incidentesColl.insertOne(newIncidente, (err, rslt)=>{
                 if(err){
                     console.log(err);
                     return res.status(404).json({"error":"Error al extraer plantas de la base de datos"});
                 }
                 if(rslt.ops.length===0){
                     console.log(rslt);
                     return res.status(404).json({"error":"Error al extraer plantas de la base de datos"});
                 } 
                 return res.status(200).json(rslt.ops[0]);
         });
     }); 

     router.put('/asign/:id', (req,res,next) =>{
        var query = {"_id": new ObjectID(req.params.id)};
        var update = {"$inc":{"fechaHoraAsignado": new Date().getTime()}};

        incidentesColl.updateOne(query, update, (err,rslt)=>{
            if(err){
                console.log(err);
                return res.status(404).json({"error": "No se puede modificar"});
            }
           return res.status(200).json(rslt);
        })
    });

    router.put('/close/:id', (req,res,next) =>{
        var query = {"_id": new ObjectID(req.params.id)};
        var update = {"$inc":{"fechaHoraCerrado": new Date().getTime()}};

        incidentesColl.updateOne(query, update, (err,rslt)=>{
            if(err){
                console.log(err);
                return res.status(404).json({"error": "No se puede modificar"});
            }
           return res.status(200).json(rslt);
        })
    });

    router.delete('/:id', (req,res,next) =>{
        var query = {"_id": new ObjectID(req.params.id)};

        incidentesColl.removeOne(query, (err,rslt)=>{
            if(err){
                console.log(err);
                return res.status(404).json({"error": "No se puedo borrar"});
            }
           return res.status(200).json(rslt);
        })
    });
    return router;
}
module.exports = initIncidentes;