const Joi = require('joi');
const validateIdea = (idea) => {
  const schema = Joi.object().keys({
    title: Joi.string().min(2).max(50).required(),
    details: Joi.string().min(2).max(1024).required(),
    date: Joi.date(),
    
  })
    
  return schema.validate(idea)
}

module.exports=validateIdea
