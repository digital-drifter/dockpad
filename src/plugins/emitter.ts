import Vue, { VueConstructor } from 'vue'

const emitter = new Vue()

export { emitter }

export default (vm: VueConstructor<Vue>) => {
  Object.defineProperty(vm.prototype, '$emitter', {
    value: emitter
  })
}
