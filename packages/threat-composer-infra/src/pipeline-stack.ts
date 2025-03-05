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
    const repositoryName = this.node.tryGetContext('repositoryName') || 'threat_composer_monorepo';
    const repositoryOwnerAndName = this.node.tryGetContext('repositoryOwnerAndName');
    const codestarConnectionArn = this.node.tryGetContext('codestarConnectionArn');
    if (useCodeCommit) {
      // Using CodeCommit
      this.pipeline = new PDKPipeline(this, 'ApplicationPipeline', {
        primarySynthDirectory: 'packages/threat-composer-infra/cdk.out',
        repositoryName: repositoryName,
        defaultBranchName: 'main',
        crossAccountKeys: true,
        useCodeCommit: true,
        sonarCodeScannerConfig: this.node.tryGetContext('sonarqubeScannerConfig'),
        // Required even for CodeCommit
        codestarConnectionArn: '',
        repositoryOwnerAndName: `dummy/${repositoryName}`,
      });
    } else {
      // Using CodeStar connection

      console.log('Context values:');
      console.log('  useCodeCommit:', useCodeCommit);
      console.log('  codestarConnectionArn:', codestarConnectionArn);
      console.log('  repositoryOwnerAndName:', repositoryOwnerAndName);

      // Validate required parameters
      if (!codestarConnectionArn) {
        throw new Error('codestarConnectionArn context value is required when useCodeCommit is false. ' +
          'Either provide this value or set useCodeCommit to true.');
      }

      if (!repositoryOwnerAndName) {
        throw new Error('repositoryOwnerAndName context value is required when useCodeCommit is false. ' +
          'Format should be "owner/repo".');
      }

      // Extract the repository name from owner/repo format
      const repoName = repositoryOwnerAndName.includes('/') ?
        repositoryOwnerAndName.split('/')[1] :
        repositoryName;

      this.pipeline = new PDKPipeline(this, 'ApplicationPipeline', {
        primarySynthDirectory: 'packages/threat-composer-infra/cdk.out',
        repositoryOwnerAndName: repositoryOwnerAndName,
        codestarConnectionArn: codestarConnectionArn,
        defaultBranchName: 'main',
        crossAccountKeys: true,
        useCodeCommit: false,
        sonarCodeScannerConfig: this.node.tryGetContext('sonarqubeScannerConfig'),
        repositoryName: repoName,
      });
    }
  }
}