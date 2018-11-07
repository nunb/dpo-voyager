/**
 * 3D Foundation Project
 * Copyright 2018 Smithsonian Institution
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as THREE from "three";

import Component, { IComponentEvent } from "@ff/core/ecs/Component";

import Transform from "./Transform";

////////////////////////////////////////////////////////////////////////////////

export interface IObject3DObjectEvent extends IComponentEvent<Object3D>
{
    current: THREE.Object3D;
    next: THREE.Object3D;
}

export default class Object3D extends Component
{
    static readonly type: string = "Object3D";

    protected _transform: Transform = null;
    private _object: THREE.Object3D = null;

    constructor(id?: string)
    {
        super(id);
        this.addEvent("object");
    }

    get transform(): Transform
    {
        return this._transform;
    }

    get object3D(): THREE.Object3D | null
    {
        return this._object;
    }

    set object3D(object: THREE.Object3D)
    {
        if (this._object && this._transform) {
            this._transform.removeObject3D(this._object);
        }

        this.emit<IObject3DObjectEvent>("object", { current: this._object, next: object });
        this._object = object;

        if (object) {
            object.matrixAutoUpdate = false;

            if (this._transform) {
                this._transform.addObject3D(object);
            }
        }
    }

    create()
    {
        this.trackComponent(Transform, transform => {
            this._transform = transform;
            if (this._object) {
                transform.addObject3D(this._object);
            }
        }, transform => {
            this._transform = null;
            if (this._object) {
                transform.removeObject3D(this._object);
            }
        });
    }

    dispose()
    {
        if (this._object && this._transform) {
            this._transform.removeObject3D(this._object);
        }

        super.dispose();
    }

    toString()
    {
        return super.toString() + (this._object ? ` - type: ${this._object.type}` : " - (null)");
    }
}