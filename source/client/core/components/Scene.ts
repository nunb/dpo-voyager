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

import { Readonly } from "@ff/core/types";
import types from "@ff/core/ecs/propertyTypes";
import Hierarchy from "@ff/core/ecs/Hierarchy";

import Transform from "./Transform";

import { EShaderMode } from "../shaders/UberMaterial";
import Model from "./Model";

////////////////////////////////////////////////////////////////////////////////

export { EShaderMode };

const _color = new THREE.Color();


export default class Scene extends Hierarchy
{
    static readonly type: string = "Scene";

    ins = this.makeProps({
        col: types.ColorRGB("Background.Color", [ 0.0, 0.0, 0.0 ]),
        sha: types.Enum("Shader.Mode", EShaderMode, EShaderMode.Default)
    });

    protected _scene: THREE.Scene = new THREE.Scene();

    get scene(): THREE.Scene
    {
        return this._scene;
    }

    /**
     * Returns an array of child components of this.
     * @returns {Readonly<Hierarchy[]>}
     */
    get children(): Readonly<Transform[]>
    {
        return this._children as Transform[] || [];
    }

    create()
    {
        this._scene.background = new THREE.TextureLoader().load("images/bg-gradient-grey.jpg");
    }

    update()
    {
        const { col, sha } = this.ins;

        if (col.changed) {
            //_color.fromArray(col.value);
            //this._scene.background = _color;
        }
        if (sha.changed) {
            const index = types.getEnumEntry(EShaderMode, sha.value);
            this.getComponentsInSubtree(Model).forEach(model => model.setShaderMode(index));
        }
    }

    addChild(component: Transform)
    {
        super.addChild(component);
        this._scene.add(component.object3D);
    }

    removeChild(component: Transform)
    {
        this._scene.remove(component.object3D);
        super.removeChild(component);
    }
}