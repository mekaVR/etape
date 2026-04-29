interface EmailVerificationTemplateParams {
  verifyUrl: string;
  logoUrl: string;
  expiresInHours: number;
}

export function emailVerificationTemplate({
  verifyUrl,
  logoUrl,
  expiresInHours,
}: EmailVerificationTemplateParams): string {
  return `<!doctype html>                                                                                                                                                                                               
    <html lang="fr">                                         
    <head>                                                                                                                                                                                                                
      <meta charset="utf-8">             
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Vérification de votre adresse email</title>     
    </head>                                      
    <body style="margin:0; padding:0; background-color:#f6f6f6; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color:#1d1d1b;">                                  
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f6f6;">
        <tr>                                                                                                                                                                                                              
          <td align="center" style="padding:40px 16px;">     
            <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px; width:100%; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px                 
  rgba(0,0,0,0.06);">                    
              <tr>                                                                                                                                                                                                        
                <td align="center" style="padding:32px 32px 16px;">                                                                                                                                                       
                  <img src="${logoUrl}" alt="Transition Pro" width="180" style="display:block; height:auto; max-width:180px;">                                                                                            
                </td>                                                                                                                                                                                                     
              </tr>                                                                                                                                                                                                       
              <tr>                                                                                                                                                                                                        
                <td style="padding:8px 40px 0;">                                                                                                                                                                          
                  <h1 style="margin:0 0 16px; font-size:22px; font-weight:600; color:#1d1d1b; text-align:center;">
                    Confirmez votre adresse email                                                                                                                                                                         
                  </h1>                                                                                                                                                                                                   
                  <p style="margin:0 0 24px; font-size:15px; line-height:1.6; color:#575756;">                                                                                                                            
                    Vous venez de créer un compte Transition Pro. Cliquez sur le bouton ci-dessous pour confirmer votre adresse email et activer votre compte.                                                            
                  </p>                                                                                                                                                                                                    
                </td>                                        
              </tr>                                                                                                                                                                                                       
              <tr>                                                                                                                                                                                                        
                <td align="center" style="padding:0 40px 24px;">                                                                                                                                                          
                  <a href="${verifyUrl}" style="display:inline-block; background-color:#00aba9; color:#ffffff; text-decoration:none; padding:14px 32px; border-radius:6px; font-size:15px; font-weight:600;">             
                    Confirmer mon adresse email                                                                                                                                                                           
                  </a>                                                                                                                                                                                                    
                </td>                                                                                                                                                                                                     
              </tr>                                                                                                                                                                                                       
              <tr>                       
                <td style="padding:0 40px 24px;">                                                                                                                                                                         
                  <p style="margin:0 0 8px; font-size:13px; line-height:1.6; color:#575756;">
                    Ce lien est valable <strong>${expiresInHours} heures</strong>. Passé ce délai, vous devrez demander un nouveau mail de confirmation.                                                                  
                  </p>                                       
                  <p style="margin:0; font-size:13px; line-height:1.6; color:#575756; word-break:break-all;">                                                                                                             
                    Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :<br>
                    <a href="${verifyUrl}" style="color:#4432aa; text-decoration:underline;">${verifyUrl}</a>                                                                                                             
                  </p>                                       
                </td>                                                                                                                                                                                                     
              </tr>                                                                                                                                                                                                       
              <tr>                                                                                                                                                                                                        
                <td style="padding:24px 40px; background-color:#f0f8f7; border-top:1px solid #d3caca;">                                                                                                                   
                  <p style="margin:0; font-size:12px; line-height:1.5; color:#575756; text-align:center;">                                                                                                                
                    Si vous n'êtes pas à l'origine de cette inscription, vous pouvez ignorer cet email.                                                                                                                   
                  </p>                                                                                                                                                                                                    
                </td>                                                                                                                                                                                                     
              </tr>                                                                                                                                                                                                       
            </table>                     
            <p style="margin:24px 0 0; font-size:12px; color:#999999; text-align:center;">                                                                                                                                
              © ${new Date().getFullYear()} Transition Pro                                                                                                                                                                
            </p>                                                                                                                                                                                                          
          </td>                                                                                                                                                                                                           
        </tr>                                                                                                                                                                                                             
      </table>                                                                                                                                                                                                            
    </body>                              
    </html>`;
}
