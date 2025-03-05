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

    const useCodeCommit = this.node.tryGetContext('useCodeCommit');
    const repositoryName = this.node.tryGetContext('repositoryName') || 'monorepo';

    if (useCodeCommit) {
      this.pipeline = new PDKPipeline(this, 'ApplicationPipeline', {
        primarySynthDirectory: 'packages/threat-composer-infra/cdk.out',
        repositoryName: repositoryName,
        defaultBranchName: 'main',
        crossAccountKeys: true,
        useCodeCommit: true,
        sonarCodeScannerConfig: this.node.tryGetContext('sonarqubeScannerConfig'),
        // Add the required CodeStar properties with default values
        codestarConnectionArn: '',  // Empty string since not using CodeStar
        repositoryOwnerAndName: `dummy/${repositoryName}`,  // Dummy value since not using CodeStar
      });
    } else {
      // The error is happening here - repositoryOwnerAndName is undefined
      // Let's properly define it with a fallback value

      // Get the context values with fallbacks
      const repositoryOwnerAndName = this.node.tryGetContext('repositoryOwnerAndName');
      const codestarConnectionArn = this.node.tryGetContext('codestarConnectionArn');

      // Create the pipeline with all required properties
      this.pipeline = new PDKPipeline(this, 'ApplicationPipeline', {
        primarySynthDirectory: 'packages/threat-composer-infra/cdk.out',
        repositoryOwnerAndName: repositoryOwnerAndName || 'dummy/repo',  // Provide fallback
        codestarConnectionArn: codestarConnectionArn || '',  // Provide fallback
        defaultBranchName: 'main',
        crossAccountKeys: true,
        useCodeCommit: false,
        sonarCodeScannerConfig: this.node.tryGetContext('sonarqubeScannerConfig'),
        // Safely determine repository name with null checks
        repositoryName: repositoryOwnerAndName ?
          (repositoryOwnerAndName.includes('/') ?
            repositoryOwnerAndName.split('/')[1] :
            repositoryOwnerAndName) :
          'dummy-repo',
      });
    }
  }
}