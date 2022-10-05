# Sample Lambda With Security Group


## Important Note....
   This example makes massive assumptions with regards to the VPC. You should NOT run this in any production capacity. 

   Since this repo assumes there's no existing VPC to hook onto it will create one, since this function also has Nat Egress if there
   is no NAT Gateway then it will create 1.




## Command Examples
 ```
 # build the npm module
   npm build

 # deploy the cdk stack
   cdk deploy --profile <aws_creds_profile>

 # destroying the stack
   cdk destroy --profile <aws_creds_profile>     
 ```  

