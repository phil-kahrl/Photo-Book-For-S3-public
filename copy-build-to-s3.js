var AWS = require('aws-sdk');
var fs = require('fs')

const S3_VERSION = '2006-03-01'
const releaseBucket = 'cathexis-template-release'

console.log('copy to s3')

const s3 = new AWS.S3({ apiVersion: S3_VERSION, region: 'us-west-2'});

let dirs = ['', '/admin', '/static/css', '/static/js'].map( x => 'build' + x)

let fileList = []

dirs.forEach( (dir) => {
   fs.readdirSync(dir).forEach( (fn) => {
       let filename = dir + '/' + fn
       if(fileList.indexOf(filename) < 0) fileList.push(filename)
   })
})

fileList = fileList.filter( (fn) => (!fn.endsWith('.map')))

let versionNumber = ''
fileList.forEach( (current) => {
    if(current.endsWith('.js')) versionNumber = current.substring(current.indexOf('.') + 1, current.length -3)
})
console.log('[versionNumber] ' + versionNumber)

fs.writeFileSync('tagVersion.sh', `git tag ${versionNumber}; git push origin ${versionNumber}`)

const fileStats = new fs.Stats('.')

const getContentType = (filename) => {
    let result = 'text/html'
    if(filename.endsWith('js')) result = 'application/javascript'
    if(filename.endsWith('js.map')) result = 'application/javascript'
    if(filename.endsWith('css.map')) result = 'text/css'
    if(filename.endsWith('css')) result = 'text/css'
    if(filename.endsWith('png')) result = 'image/png'
    if(filename.endsWith('gif')) result = 'image/gif'
    if(filename.endsWith('jpeg')) result = 'image/jpeg'
    if(filename.endsWith('jpg')) result = 'image/jpeg'
    if(filename.endsWith('svg')) result = 'image/svg+xml'
    if(filename.endsWith('json')) result = 'application/json'
    if(filename.endsWith('xml')) result = 'application/xml'
    if(filename.endsWith('ico')) result = 'image/x-icon'
    return result
}

const uploadToS3 =  () => {
        var needToUploadCount = fileList.length
        var uploadedCount = 0
        let maxCount = 50
        let loopCount = 0
        let sent = false
        //while(uploadedCount < needToUploadCount) {
        
        if (!sent){
            fileList.forEach( (fn) => {
                let fullFileName = `${process.env.PWD}/${fn}`
                console.log('[processing file] ' + fn)
                let fileBuffer
                try {
                    fileBuffer = fs.readFileSync(fullFileName )
                } catch (error) {}
                if(fileBuffer){
                    console.log('uploading file ' + fullFileName)
                    let key = `${versionNumber}/${fn}`
                    key = key.replace('build/', '')

                    const params =  {
                        Bucket: releaseBucket,
                        Key: `${key}`,
                        Body: fileBuffer,
                        ContentType: getContentType(fn)
                    }
                    
                    console.log('s3 put object')
                    console.log(params.Key)
                    console.log(params.ContentType)

                    s3.putObject(
                       params,
                        //{ partSize: 2 * 10 * 1024 * 1024, queueSize: 1 },
                        (err, data) => {
                            if (err) {
                                console.log(err)
                                throw new Error(err)
                            }
                            else {
                                uploadedCount ++
                                console.log('[uploaded]' + fn)
                                if(uploadedCount === needToUploadCount)console.log('ALL UPLOADS COMPLETE')
                            }
                        });
        
                } else {
                    console.log('[is not a file] ' + fullFileName )
                    --needToUploadCount 
                }
            })
            sent = true
        }
        console.log('Request sent to Queue')

    //}
}

uploadToS3()



