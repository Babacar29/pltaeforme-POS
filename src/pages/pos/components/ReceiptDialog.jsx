import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

const ReceiptDialog = ({ isOpen, onOpenChange, lastSale }) => {
  const { toast } = useToast();

  // Fonction utilitaire pour calculer l'âge à partir de la date de naissance (format YYYY-MM-DD)
  function getAge(birthDate) {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  const now = new Date();
  const dateHeureFr = now.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const printReceipt = () => {
    // Crée une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '', 'width=500,height=600');
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
            body { font-family: monospace; margin: 0; padding: 5px; }
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
          <div class="center bold">Koromack Sombel Diop de Nianing</div>
          <div class="center">Reçu de Vente</div>
          <div class="center">
            ${dateHeureFr}
          </div>
          <hr />
          ${lastSale && lastSale.patient ? `
            <div><span class='bold'>Patient:</span> ${lastSale.patient.firstName} ${lastSale.patient.lastName}</div>
            <div><span class='bold'>Téléphone:</span> ${lastSale.patient.phone || ''}</div>
            <div><span class='bold'>Âge:</span> ${getAge(lastSale.patient.birthDate || lastSale.patient.birth_date)}</div>
          ` : ''}
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
                {new Date(lastSale.date).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
              </p>
            </div>

            {lastSale.patient && (
              <div className="mb-4 pb-2 border-b border-dashed space-y-1">
                <p className="text-sm"><strong>Patient:</strong> {lastSale.patient.firstName} {lastSale.patient.lastName}</p>
                <p className="text-sm"><strong>Téléphone:</strong> {lastSale.patient.phone || ''}</p>
                <p className="text-sm"><strong>Âge:</strong> {getAge(lastSale.patient.birthDate || lastSale.patient.birth_date)}</p>
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