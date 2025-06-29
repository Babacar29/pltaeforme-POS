import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

const ReceiptDialog = ({ isOpen, onOpenChange, lastSale }) => {
  const { toast } = useToast();

  const printReceipt = () => {
    // Crée une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '', 'width=350,height=600');
    if (!printWindow) {
      toast({ title: "Impossible d'ouvrir la fenêtre d'impression" });
      return;
    }
    // Génère le contenu du ticket
    const receiptHtml = `
      <html>
        <head>
          <title>Reçu de Vente</title>
          <style>
            body { font-family: monospace; margin: 0; padding: 20px; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .items { margin: 16px 0; }
            .item-row { display: flex; justify-content: space-between; font-size: 14px; }
            .total { border-top: 1px dashed #000; margin-top: 12px; padding-top: 8px; font-size: 16px; font-weight: bold; display: flex; justify-content: space-between; }
            .footer { margin-top: 24px; font-size: 12px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="center bold">Centre de Santé</div>
          <div class="center">Reçu de Vente</div>
          <div class="center">
            ${lastSale ? new Date(lastSale.date).toLocaleString('fr-FR') : ''}
          </div>
          <hr />
          ${lastSale && lastSale.patient ? `<div><span class='bold'>Patient:</span> ${lastSale.patient.firstName} ${lastSale.patient.lastName}</div>` : ''}
          <div class="items">
            ${(lastSale?.items || []).map(item => `
              <div class="item-row">
                <span>${item.name} x${item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)} XOF</span>
              </div>
            `).join('')}
          </div>
          <div class="total">
            <span>Total:</span>
            <span>${lastSale ? lastSale.total.toFixed(2) : '0.00'} XOF</span>
          </div>
          <div class="footer">
            Merci de votre visite !<br />
            Reçu #${lastSale ? lastSale.id : ''}
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reçu de Vente</DialogTitle>
          <DialogDescription>
            Vente finalisée avec succès
          </DialogDescription>
        </DialogHeader>
        
        {lastSale && (
          <div className="receipt-paper p-6 rounded-lg">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">Centre de Santé</h2>
              <p className="text-sm text-muted-foreground">Reçu de Vente</p>
              <p className="text-xs text-muted-foreground">
                {new Date(lastSale.date).toLocaleString('fr-FR')}
              </p>
            </div>

            {lastSale.patient && (
              <div className="mb-4 pb-2 border-b border-dashed">
                <p className="text-sm"><strong>Patient:</strong></p>
                <p className="text-sm">
                  {lastSale.patient.firstName} {lastSale.patient.lastName}
                </p>
              </div>
            )}

            <div className="space-y-2 mb-4">
              {lastSale.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p>{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.price.toFixed(2)} XOF × {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium">
                    {(item.price * item.quantity).toFixed(2)} XOF
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed pt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{lastSale.total.toFixed(2)} XOF</span>
              </div>
            </div>

            <div className="text-center mt-6 text-xs text-muted-foreground">
              <p>Merci de votre visite!</p>
              <p>Reçu #{lastSale.id}</p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button onClick={printReceipt}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDialog;