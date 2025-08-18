import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '@layout/sidebar/sidebar';
import Spinner from '@shared/components/spinner/spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Spinner],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
