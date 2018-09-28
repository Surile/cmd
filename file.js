const fs = require('fs')
const stripJsonComments = require('strip-json-comments')

const loadJsonFile = file => {
  const json = fs.readFileSync(file).toString()
  return JSON.parse(stripJsonComments(json))
}

const variableParams = loadJsonFile('./json.json')

const findApiName = (name, request) => {
  let schemaTypes = variableParams.__schema.types

  let params = null
  let graphql_func_form = null
  let graphql_form = null
  schemaTypes.map(schemaType => {
    if (schemaType.fields !== null) {
      params = schemaType.fields.find(field => field.name === name)
      if (params !== undefined) {
        let graphql_form_array_key = []
        let graphql_form_array_val = []
        for (const arg of params.args) {
          graphql_form_array_key.push(`$${arg.name}:${arg.type.name};`)
          graphql_form_array_val.push(`${arg.name}:$${arg.name};`)
        }
        function graphqlFormKey() {
          var graphql_form_key = ''
          for (let index = 0; index < graphql_form_array_key.length; index++) {
            graphql_form_key += graphql_form_array_key[index]
          }
          return graphql_form_key
        }
        function grqphqlFormVal() {
          var graphql_form_val = ''
          for (let index = 0; index < graphql_form_array_val.length; index++) {
            graphql_form_val += graphql_form_array_val[index]
          }
          return graphql_form_val
        }
        graphql_func_form = graphqlFormKey().replace(/;/g, '\n')
        graphql_form = grqphqlFormVal().replace(/;/g, '\n')
      }
    }
  })

  if (request === 'query') {
    fs.writeFile(
      `${name}.js`,
      `
        query(
          ${graphql_func_form}
        ){
          ${name}(
            ${graphql_form}
          ){

          }
        }
      `,
      'utf8',
      err => {
        if (err) throw err
        console.log("It's saved!")
      }
    )
  } else {
    console.log('hhah')
  }
}

module.exports = findApiName
