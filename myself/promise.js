
function Promise (exculete) {
  this.callbacks = []
  this.PromiseState = 'pending'
  this.PromiseResult = null
  let self = this
  function resolve (data) {
    if(self.PromiseState !== 'pending') return
    self.PromiseState = 'fulfilled'
    self.PromiseResult = data
    self.callbacks.forEach((item) => {
      item.onResolved(data)
    })
  }

  function reject (data) {
    if(self.PromiseState !== 'pending') return
    self.PromiseState = 'rejected'
    self.PromiseResult = data
    this.callbacks.forEach((item) => {
      item.onRejected(data)
    })
  }

  try {
    exculete(resolve, reject)
  } catch (e) {
    reject(e)
  }
}
Promise.prototype.then = function (onResolved, onRejected) {
  const self = this
  return new Promise((resolve, reject) => {
    if(this.PromiseState === 'fulfilled') {
      const res = onResolved(this.PromiseResult)
      if(res instanceof Promise) {
        res.then(v=>{
          resolve(v)
        }, e => {
          reject(e)
        })
      } else {
        resolve(res)
      }
    }
    if(this.PromiseState === 'rejected') {
      onRejected(this.PromiseResult)
    }
    if(this.PromiseState === 'pending') {
      this.callbacks.push({
        onResolved: function (){
          const res = onResolved(self.PromiseResult)
          if(res instanceof Promise) {
            res.then(v=>{
              resolve(v)
            }, e => {
              reject(e)
            })
          } else {
            resolve(res)
          }
        },
        onRejected: function() {
          onRejected(self.PromiseResult)
        }
      })
    }
  })
}