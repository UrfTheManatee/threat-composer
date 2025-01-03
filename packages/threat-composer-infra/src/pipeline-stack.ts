/** *******************************************************************************************************************
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 ******************************************************************************************************************** */
import { PDKPipeline } from '@aws/pdk/pipeline';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class PipelineStack extends Stack {
  readonly pipeline: PDKPipeline;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    if (this.node.tryGetContext('useCodeCommit')) {
      this.pipeline = new PDKPipeline(this, 'ApplicationPipeline', {
        primarySynthDirectory: 'packages/threat-composer-infra/cdk.out',
        repositoryName: this.node.tryGetContext('repositoryName') || 'monorepo',
        defaultBranchName: 'main',
        crossAccountKeys: true,
        synth: {commands:['']},
        sonarCodeScannerConfig: this.node.tryGetContext('sonarqubeScannerConfig'),
      });
    } else {
      this.pipeline = new PDKPipeline(this, 'ApplicationPipeline', {
        primarySynthDirectory: 'packages/threat-composer-infra/cdk.out',
        repositoryOwnerAndName: this.node.tryGetContext('repositoryOwnerAndName'),
        codestarConnectionArn: this.node.tryGetContext('codestarConnectionArn'),
        defaultBranchName: 'main',
        crossAccountKeys: true,
        synth: {commands:['']},
        sonarCodeScannerConfig: this.node.tryGetContext('sonarqubeScannerConfig'),
      });
    }
  }
}
