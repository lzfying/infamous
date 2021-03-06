
import { observe, unobserve } from 'james-bond'
import Class from 'lowclass'
import Mixin from 'lowclass/Mixin'
import {getInheritedDescriptor} from 'lowclass/utils'

export default
Mixin(Base => Class( 'forwardProps' ).extends( Base, ({ Super, Public, Protected, Private }) => ({

    connectedCallback() {
        Super( this ).connectedCallback && Super( this ).connectedCallback()
        Private( this ).__receivePropsFromObject()
    },

    disconnectedCallback() {
        Super( this ).disconnectedCallback && Super( this ).disconnectedCallback()
        Private( this ).__unreceivePropsFromObject()
    },

    private: {
        propChangedCallback: ( propName, value ) => undefined,

        __receivePropsFromObject() {
            const publicThis = Public( this )
            this.propChangedCallback = ( propName, value ) => publicThis[ propName ] = value
            observe( Protected( this )._observedObject, this.__getProps(), this.propChangedCallback, {
                // inherited: true, // XXX the 'inherited' option doesn't work in this case. Why?
            } )
        },

        __unreceivePropsFromObject() {
            unobserve(Protected( this )._observedObject, this.__getProps(), this.propChangedCallback )
        },

        __getProps() {
            let result
            const props = Public( this ).constructor.props

            if ( Array.isArray( props ) ) result = props
            else {
                result = []
                if ( typeof props === 'object' )
                    for ( const prop in props )
                        result.push( prop )
            }

            return result
        },
    },

    protected: {
        get _observedObject() {
            throw new TypeError(`
                The subclass using forwardProps must define a protected
                _observedObject property defining the object from which props
                are forwarded.
            `)
        },
    }

})))
