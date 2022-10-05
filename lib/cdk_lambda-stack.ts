import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as lb from "aws-cdk-lib/aws-lambda"

export class CdkLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'vpc', {
      cidr: "10.250.0.0/16",
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "private-subnet",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,  //this will generate the NATs needed.
        },
        {
          cidrMask: 24,
          name: "public-subnet",
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
      maxAzs: 1,
    });

    const lambdaSecurityGroup = new ec2.SecurityGroup(this, "lbSecurityGroup", {
      vpc: vpc,
      allowAllOutbound: true,
      description: 'Lambda Security Group'
    });

    //allow the lambda to talk to the internet only over HTTPS, we shouldn't trust port 80
    lambdaSecurityGroup.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443));
    lambdaSecurityGroup.addEgressRule(ec2.Peer.anyIpv6(), ec2.Port.tcp(443));


    new lb.Function(this, 'ExampleLambda', {
      code: lb.Code.fromAsset('./LambdaFunctions'),
      functionName: 'GenerateRandomNumber',
      handler: 'generateRandomNumber.lambdaHandler',
      timeout: cdk.Duration.seconds(300),
      runtime: lb.Runtime.NODEJS_16_X,
      vpc:vpc,
      vpcSubnets: {
            subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [lambdaSecurityGroup],
    });

  }
}
