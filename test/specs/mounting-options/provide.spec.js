import { config } from '~vue/test-utils'
import ComponentWithInject from '~resources/components/component-with-inject.vue'
import { injectSupported } from '~resources/utils'
import {
  describeWithMountingMethods,
  itDoNotRunIf
} from '~resources/utils'

describeWithMountingMethods('options.provide', (mountingMethod) => {
  let configProvideSave

  beforeEach(() => {
    configProvideSave = config.provide
    config.provide = {}
  })

  afterEach(() => {
    config.provide = configProvideSave
  })

  itDoNotRunIf(!injectSupported(),
    'provides objects which is injected by mounted component', () => {
      if (!injectSupported()) return

      const wrapper = mountingMethod(ComponentWithInject, {
        provide: { fromMount: 'objectValue' }
      })
      const HTML = mountingMethod.name === 'renderToString'
        ? wrapper
        : wrapper.html()
      expect(HTML).to.contain('objectValue')
    })

  itDoNotRunIf(!injectSupported(),
    'provides function which is injected by mounted component', () => {
      const wrapper = mountingMethod(ComponentWithInject, {
        provide () {
          return {
            fromMount: 'functionValue'
          }
        }
      })
      const HTML = mountingMethod.name === 'renderToString'
        ? wrapper
        : wrapper.html()
      expect(HTML).to.contain('functionValue')
    })

  itDoNotRunIf(!injectSupported() || mountingMethod.name === 'renderToString',
    'supports beforeCreate in component', () => {
      if (!injectSupported()) return

      const wrapper = mountingMethod(ComponentWithInject, {
        provide: { fromMount: '_' }
      })

      expect(wrapper.vm.setInBeforeCreate).to.equal('created')
    })

  itDoNotRunIf(!injectSupported(), 'injects the provide from the config', () => {
    config.provide['fromMount'] = 'globalConfig'

    const wrapper = mountingMethod(ComponentWithInject)
    const HTML = mountingMethod.name === 'renderToString'
      ? wrapper
      : wrapper.html()

    expect(HTML).to.contain('globalConfig')
  })

  itDoNotRunIf(!injectSupported(), 'prioritize mounting options over config', () => {
    config.provide['fromMount'] = 'globalConfig'

    const wrapper = mountingMethod(ComponentWithInject, {
      provide: { fromMount: '_' }
    })
    const HTML = mountingMethod.name === 'renderToString'
      ? wrapper
      : wrapper.html()

    expect(HTML).to.contain('_')
  })

  itDoNotRunIf(!injectSupported(), 'config with function throws', () => {
    config.provide = () => {}

    expect(() => {
      mountingMethod(ComponentWithInject, {
        provide: { fromMount: '_' }
      })
    }).to.throw()
  })
})
