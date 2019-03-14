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

import Node from "@ff/graph/Node";

import CVAssetLoader from "../../core/components/CVAssetLoader";
import CVInterface from "../components/CVInterface";
import CVReader from "../components/CVReader";
import CVTourPlayer from "../components/CVTourPlayer";

////////////////////////////////////////////////////////////////////////////////

export default class NVExplorer extends Node
{
    static readonly typeName: string = "NVExplorer";

    createComponents()
    {
        this.createComponent(CVAssetLoader);
        this.createComponent(CVInterface);
        this.createComponent(CVReader);
        this.createComponent(CVTourPlayer);
    }
}